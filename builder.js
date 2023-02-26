//* Essentials
const fs = require("fs");
const path = require("path");
const util = require("util");
const rollup = require("rollup");
const asyncStat = fs.promises.stat;
const colors = require("ansi-colors");
const asyncRm = util.promisify(fs.rm);
const asyncReadDir = util.promisify(fs.readdir);
const asyncReadFile = util.promisify(fs.readFile);
const asyncAppendFile = util.promisify(fs.appendFile);

//* dir containing all the packages 
const PACKAGES_DIR = path.join(__dirname, 'packages');

//* Rollup declarations
//? Type declarations
// const dts = require("rollup-plugin-dts");
//? Asset handler
const image = require('@rollup/plugin-image');
//? minifier
const terser = require("@rollup/plugin-terser");
//? CSS handler
const postcss = require("rollup-plugin-postcss");
//? JSX transpiler
const { babel } = require("@rollup/plugin-babel");
//? Resolve commonjs
const commonjs = require("@rollup/plugin-commonjs");
//? Node resolve algorithm
const resolve = require("@rollup/plugin-node-resolve");
//? TS handler
const typescript = require("@rollup/plugin-typescript");
//? Peer dependencies
const peerDepsExternal = require("rollup-plugin-peer-deps-external");

//* Wrapper function to encapsulate functions with exception handling
//* Only wrap async functions with this
async function tryCatcher(targetFunction) {
	try {
		return await targetFunction()
	}
	catch (e) {
		console.log("Error origin: ", targetFunction.name)
		console.log("Error message: ", e)
	}
}

//* Generator function to read package.json of the packages
function* readFileGenerator(dirsArr, fileSuffix = '') {
	const filePromises = dirsArr.map(dir => asyncReadFile(path.join(dir, fileSuffix), "utf8"))
	for (const promise of filePromises) {
		yield promise
	}
}

//* Function to go in pacakges and retrieve package entry points
async function dirContentLoader(targetDir) {
	const packages = await tryCatcher(() => asyncReadDir(targetDir))
	return packages.map(item => path.join(targetDir, item))
}

//* Function to check whether the mentioned package exists or not
async function checkDirORFileExists(dirORFilePath, throwOnError = true) {
	// console.log("DIR PATH: ", dirORFilePath, "THROW: ", throwOnError)
	if (!!(await asyncStat(dirORFilePath).catch(e => {
		if (throwOnError) {
			console.log(colors.bold.red("Error at checkDirORFileExists() while reading:"), dirORFilePath);
			console.log(colors.bold.red("Error message:"), e)
		}

		return false
	}))) return [dirORFilePath]

	//* Throw error when required only, not everytime
	if (throwOnError) {
		throw new Error("Dir/file path does not exists, check path again!")
	}
	else {
		return false
	}
}

//* Function to return array of package dirs
const getPackageDirectory = () => {
	if (process.argv.length < 2 || process.argv.length > 4) {
		throw new Error("Invalid arguments!\nCommand format: node builder.js -p {package-name | all}")
	}

	const argsArr = process.argv.slice(2)
	if (argsArr[0] !== "-p") throw new Error("Invalid arguments!\nCommand format: node builder.js -p {package-name | all}")

	//* Bundle for all packages 
	if (argsArr[1] === "all") {
		return tryCatcher(() => dirContentLoader(PACKAGES_DIR))
	}
	//* Bundle for the specified package only 
	else {
		return checkDirORFileExists(path.join(PACKAGES_DIR, argsArr[1]))
	}
}

//* Function to create Final bundle of the packages
const createFinalBundle = async (inputOptions, outputOptions) => {
	const bundle = await rollup.rollup(inputOptions)

	for await (const option of outputOptions) {
		await bundle.write(option)
	}
}

//* Function to relocate types files from 'lib/' to 'dist/', moving up one dir up
const repositionTypeFiles = async (targetDir) => {
	//* Source lib directory, where to pick type files from
	const sourceLibDir = path.join(targetDir, 'lib')

	//* Get All the conents in the targetDir
	const dirTypeFiles = await dirContentLoader(sourceLibDir)

	//* Target directory to copy all the type definitions at
	const targetPropFileDir = path.join(targetDir, 'index.d.ts')

	// //* Reading every file and wrtiting the content to dist/index.d.ts
	for await (const fileContent of readFileGenerator(dirTypeFiles)) {
		await asyncAppendFile(targetPropFileDir, fileContent, 'utf8')
	}

	// //* Then delete the source lib directory
	asyncRm(sourceLibDir, { recursive: true })
}

//* Function to check if there is previously built dist files,
//* If there is, then first remove and the create a fresh dist 
const isOldArtifactExists = async (packageName, packageDistDir) => {
	//* Remove any dist folder if there is, in the package, before building
	//* return false, not throw error, if the file/dir to delete do not exists
	if (await checkDirORFileExists(packageDistDir, false)) {
		//* dist exists
		console.log(colors.yellow(`Found old ${path.join(packageName, 'dist')} 🧳`))
		await asyncRm(packageDistDir, { recursive: true }).then(() => {
			console.log(colors.yellow(`Cleaned old ${path.join(packageName, 'dist')} 🧹`))
		}).catch((e) => {
			console.log(colors.yellow("Failed to remove old dist located at:"), packageDistDir)
			console.log(colors.red("Error :"), e)
		})
	}
}

//* Main driver function
async function main() {
	try {
		const packageDirs = await getPackageDirectory()

		//* Reading package.json of the individual packages
		for await (const fileContent of readFileGenerator(packageDirs, 'package.json')) {
			//* For dist purposes use packageName
			//* For any other custom logic (like types reposition), use packageEntryPointFileName
			const packageJSON = JSON.parse(fileContent)
			const packageName = packageJSON.name.split("/").slice(-1)[0]
			const packageDir = path.join(PACKAGES_DIR, packageName)
			const packageDistDir = path.join(packageDir, 'dist')
			const packageEntryPointDir = path.join(packageDir, packageJSON.src)
			const packageCJSName = packageJSON.main.replace('dist/', '')
			const packageESMName = packageJSON.module.replace('dist/', '')
			const packageTypesName = packageJSON.types

			//* Print metadata
			console.log(colors.blue("Package name:"), packageJSON.name)
			console.log(colors.blue("Package entry point file path:"), packageEntryPointDir)
			console.log(colors.blue("Package source point file path:"), packageJSON.src)
			console.log(colors.blue("Package main entry file path:"), packageJSON.main)
			console.log(colors.blue("Package module entry file path:"), packageJSON.module)
			console.log(colors.blue("Package types entry file path:"), packageJSON.types)
			console.log(colors.blue("Package version:"), packageJSON.version)

			//* Function to check if there is previously built dist files,
			//* If there is, then first remove and the create a fresh dist 
			await isOldArtifactExists(packageName, packageDistDir)

			//* Rollup input options
			const ROLLUP_INPUT_OPTIONS = {
				input: packageEntryPointDir,
				external: ["react", "react-dom"],
				plugins: [
					// PEER DEPENDENCIES RESOLVER
					peerDepsExternal(),
					// IMAGE RESOLVER
					image(),
					// node_modules RESOLVER
					resolve({}),
					// JSX RESOLVER
					babel({
						exclude: "node_modules/**",
						presets: ["@babel/preset-env", "@babel/preset-react"],
						babelHelpers: "runtime",
						extensions: [".js", ".ts", ".jsx", ".tsx"],
						plugins: [
							"@babel/plugin-transform-runtime",
						],
					}),
					// CSS RESOLVER
					postcss(),
					// COMMONJS RESOLVER
					commonjs(),
					// TS RESOLVER
					// If you change rootDir, then there can be consequences in repositionTypeFiles()
					typescript({ tsconfig: "./tsconfig.json", rootDir: packageDir }),
					// MINIFIER
					terser(),
				]
			}

			//* Rollup output options
			const ROLLUP_OUTPUT_OPTIONS = [
				{
					file: path.join(packageDistDir, packageCJSName),
					format: "cjs",
					sourcemap: true,
				},
				{
					file: path.join(packageDistDir, packageESMName),
					format: "esm",
					sourcemap: true,
				}
			]

			//* Creating final bundle
			await createFinalBundle(ROLLUP_INPUT_OPTIONS, ROLLUP_OUTPUT_OPTIONS)
			console.log(colors.bold.green(`Created CJS & ESM modules for ${packageJSON.name} at ${path.join(packageName, 'dist', packageCJSName)} & ${path.join(packageName, 'dist', packageESMName)} 💯`))

			//* Copy the different types from the files into one single index.d.ts file
			//~ Not necessay, but a check if dist exists 
			await checkDirORFileExists(packageDistDir)
			await repositionTypeFiles(packageDistDir)
			console.log(colors.bold.green(`Created Type declarations for ${packageJSON.name} at ${path.join(packageName, packageTypesName)} 🍒`))
		}
	}
	catch (e) {
		console.log("Error in driver function: ", e)
	}
}

// Calling main driver function
tryCatcher(main)