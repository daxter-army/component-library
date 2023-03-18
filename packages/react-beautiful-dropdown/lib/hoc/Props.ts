import { optionItemProps } from '../Props';

// Props being supplied to the component from HOC
export interface InjectedInputProps {
	isActive: boolean;
	prevValue: string;
	activeIndex: number;
	focusIndex: boolean;
	isMouseHoverAllowed: boolean;
	inputRef: React.RefObject<HTMLInputElement>;
	onKeyDownHandler: (e: KeyboardEvent) => void;
	optionsRef: React.RefObject<HTMLUListElement>;
	isActiveHandler: React.Dispatch<React.SetStateAction<boolean>>;
	onClickItemHandler: (item: optionItemProps, idx: number) => void;
	isMouseHoverAllowedHandler: React.Dispatch<React.SetStateAction<boolean>>;
	optionItemsRef: React.MutableRefObject<React.MutableRefObject<HTMLLIElement>[]>;
	focusIndexHandler: React.Dispatch<React.SetStateAction<number>>;
}

// Props getting getting from the parent component
export interface ReceivedInputProps {
	value: string;
	placeholder: string;
	error: {
		isError: boolean;
		errorText: string;
	};
	options: optionItemProps[];
	valueHandler: (val: string) => void;
	validator?: (val: string) => boolean;
	customInputStyles?: React.CSSProperties;
	customDropdownStyles?: React.CSSProperties;
	customDropdownItemStyles?: React.CSSProperties;
}