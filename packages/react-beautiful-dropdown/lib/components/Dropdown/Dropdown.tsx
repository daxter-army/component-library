import React, { createRef } from 'react'

import S from "./Styles";

import DropdownProps from "./Props"

const Dropdown = ({
	list,
	optionsRef,
	focusIndex,
	activeIndex,
	optionItemsRef,
	focusIndexHandler,
	onClickItemHandler,
	isMouseHoverAllowed,
	customDropdownStyles,
	customDropdownItemStyles,
	isMouseHoverAllowedHandler,
}: DropdownProps) => {

	// Creating refs and assigning it to the elements
	const itemRefHandler = () => {
		if (optionItemsRef.current.length <= list.length) {
			optionItemsRef.current.push(createRef<HTMLLIElement>())
		}
	}

	const onItemMouseEnterHandler = (i: number) => {
		focusIndexHandler(i)
	}

	const onDropdownMouseLeaveHandler = () => {
		focusIndexHandler(-1)
	}

	const onDropdownMouseMoveHandler = () => {
		if (!isMouseHoverAllowed) {
			isMouseHoverAllowedHandler(true)
		}
	}

	const onClickDropdownHandler = () => {
		if (!isMouseHoverAllowed) {
			isMouseHoverAllowedHandler(true)
		}
	}

	return (
		<S.Dropdown
			ref={optionsRef}
			style={customDropdownStyles}
			onClick={onClickDropdownHandler}
			onMouseMove={onDropdownMouseMoveHandler}
			onMouseLeave={onDropdownMouseLeaveHandler}
		>
			{
				list.map((item, i) => {
					itemRefHandler()

					return <S.DropdownItem
						key={item.id}
						isFocus={focusIndex === i}
						isActive={activeIndex === i}
						isMouseOn={isMouseHoverAllowed}
						ref={optionItemsRef.current[i]}
						style={customDropdownItemStyles}
						onClick={() => onClickItemHandler(item, i)}
						onMouseEnter={() => onItemMouseEnterHandler(i)}
					>
						{item.label}
					</S.DropdownItem>
				})
			}
		</S.Dropdown>
	)
}

export default Dropdown