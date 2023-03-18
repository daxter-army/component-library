import { optionItemProps } from "../../Props";

export default interface DropdownProps {
	focusIndex: number;
	activeIndex: number;
	list: optionItemProps[];
	isMouseHoverAllowed: boolean;
	onClickItemHandler: (item: optionItemProps, i: number) => void;
	focusIndexHandler: React.Dispatch<React.SetStateAction<number>>;
	optionItemsRef: React.MutableRefObject<React.RefObject<HTMLLIElement>[]>;
	isMouseHoverAllowedHandler: React.Dispatch<React.SetStateAction<boolean>>;
	// Style props
	customDropdownStyles?: React.CSSProperties;
	customDropdownItemStyles?: React.CSSProperties;
}
