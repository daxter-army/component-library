import { KeyboardEvent } from "react";

export interface optionItemProps {
	id: string;
	label: string;
}

export default interface InputProps {
	placeholder: string;
	error: {
		isError: boolean;
		errorText: string;
	};
	value: string;
	isActive: boolean;
	prevValue: string;
	focusIndex: number;
	activeIndex: number;
	options: optionItemProps[];
	isMouseHoverAllowed: boolean;
	validator?: (val: string) => boolean;
	valueHandler: (val: string) => void;
	inputRef: React.RefObject<HTMLInputElement>;
	optionsRef: React.MutableRefObject<HTMLUListElement>;
	isActiveHandler: React.Dispatch<React.SetStateAction<boolean>>;
	focusIndexHandler: React.Dispatch<React.SetStateAction<number>>;
	onKeyDownHandler: (event: KeyboardEvent<HTMLInputElement>) => void;
	onClickItemHandler: (item: optionItemProps, index: number) => void;
	isMouseHoverAllowedHandler: React.Dispatch<React.SetStateAction<boolean>>;
	optionItemsRef: React.MutableRefObject<React.MutableRefObject<HTMLLIElement>[]>;
	// Style props
	customInputStyles?: React.CSSProperties;
	customDropdownStyles?: React.CSSProperties;
	customDropdownItemStyles?: React.CSSProperties;
}