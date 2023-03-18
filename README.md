# 🚀 React + Typescript + Lerna + Rollup Component Library

* All the packages maintained by lerna are placed in `packages` dir.
* The main file is `builder.js` here, which is responsible for bundling all the packages into CJS and ESM modules.

### 📦 Adding a package
* You can follow the lerna guide for adding packages.
* Here are some commands for your reference:
	1. `lerna create @your-org/button --yes`: "To add a package",
	2. `lerna add react --scope=@your-org/button --peer`: "Add react as a peer dependency in your `@your-org/button`",
	3. `lerna add react --scope=@your-org/button --dev`: "Add react as a dev dependency in your `@your-org/button`",
	4. `lerna add @your-org/arsenal --scope=@your-org/{button, dropdown}`: "Add `@your-org/arsenal` as a dependency in your `@your-org/button` and `@your-org/dropdown` package",

### 🫶 Things to remember while creating a package
* After creating package with the `lerna create` command, you need to take care of few things in the `package.json`, so that the bundling process completes without any error. 
	1. Change the name of the entry file with the camelCase convention. If you created a package like this:
	
	```js
		lerna create @your-org/button --yes
		// rename button.js to --> Button.tsx

		lerna create @your-org/dropdown-autosuggest --yes
		// rename button.js to --> DropdownAutoSuggest.tsx
	```

	2. Edit the `src` field in the respective `package.json`, with the new name of the entry file
	
	```js
		// change this
		{																					
			... other values												
			src: lib/button.js		  					
			... other values												
		}																					

		// to this
		{																					
			... other values												
			src: lib/Button.tsx		  					
			... other values												
		}	
	```

	3. Add fields for `main` & `module` to make an entry point for `cjs` and `es module` for your package.
	
	```js
		// add these fields in your respective `package.json`
		{																					
			... other values												
			main: dist/index.cjs.js
			module: dist/index.esm.js
			... other values												
		}	
	```

	4. Add fields for `types` & `module` for your package.
	
	```js
		{																					
			... other values												
			types: dist/lib/{entry_point_file_name}.d.ts
			... other values												
		}	
	```

	5. Add `dist` to `files`

	```js
			// change this
			{																					
				... other values
				files: ['lib'],
				... other values
			}																					

			// to this
			{																					
				... other values												
				files: ['dist', 'lib'],
				... other values												
			}
	```

	6. Now you are ready for bundling your package, prepare for launch 🚀 ;). But if you still have any confusion then you can check the `package.json` of the `button` component, placed under `packages`.

### 🏁 Bundling process
* To bundle your package individually, run `node builder.js -p {package-name}`
* If you want to bundle all your packages together, just run `node builder.js -p all`
* After the bundling process is finished, you can find the respective bundled and minified files of the package in `dist` dir.