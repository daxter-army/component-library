import { optionItemProps } from "./Props"

// Function to match the given value with any value present in the array.
export const valueMatcher = (value: string, valueArr: optionItemProps[]) => {
	let isValuePresent: (boolean | number) = false

	if (value === "") return false

	for (let i = 0; i < valueArr.length; i++) {
		if (valueArr[i].label.toLowerCase().includes(value.toLowerCase())) {
			isValuePresent = i
			break
		}
	}

	return isValuePresent
}