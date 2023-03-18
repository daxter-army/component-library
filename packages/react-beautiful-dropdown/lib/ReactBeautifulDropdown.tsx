import React, { useRef } from 'react'
import Dropdown from './components/Dropdown/Dropdown'
import { MdErrorOutline } from "react-icons/md"
import { FiChevronUp, FiChevronDown } from "react-icons/fi"

import useOutsideClick from './hooks/useOutsideClick'
import withKeyboardNavigation from './hoc/withKeyboardNavigation'

import S from './Styles'

import InputProps from './Props'

const Input: React.FC<InputProps> = ({
	value,
	error,
	options,
	inputRef,
	isActive,
	prevValue,
	optionsRef,
	focusIndex,
	activeIndex,
	valueHandler,
	optionItemsRef,
	isActiveHandler,
	onKeyDownHandler,
	onClickItemHandler,
	focusIndexHandler,
	isMouseHoverAllowed,
	customInputStyles,
	customDropdownStyles,
	customDropdownItemStyles,
	isMouseHoverAllowedHandler,
	placeholder = "Placeholder",
}) => {
	// To detect outisde clicks
	const dropdownRef = useRef([inputRef, optionsRef])
	useOutsideClick(dropdownRef, () => {
		if (isActive) {
			// To only change when the value is changed
			if ((activeIndex !== focusIndex) || (activeIndex === -1 && focusIndex === -1)) valueHandler(prevValue)
			isActiveHandler(false)
			inputRef.current?.blur()
		}
	})

	const focusHandler = () => {
		isActiveHandler(true)
	}

	// const blurHandler = () => {
	// Because I don't want to unmount on input blur
	// 	setIsActive(false)
	// }

	return (
		<S.InputWpr>
			<S.InputCtr>
				<S.Input
					value={value}
					ref={inputRef}
					isActive={isActive}
					// onBlur={blurHandler}
					onFocus={focusHandler}
					placeholder={placeholder}
					style={customInputStyles}
					onKeyDown={onKeyDownHandler}
					onChange={e => valueHandler(e.target.value)}
				/>
				<S.IconCtr>
					{
						isActive
							? <FiChevronUp size={18} color={isActive ? '#3498db' : "#777"} />
							: <FiChevronDown size={18} color={isActive ? '#3498db' : "#777"} />
					}
				</S.IconCtr>
			</S.InputCtr>
			{
				error.isError && <S.ErrorLabel>{error.errorText}<MdErrorOutline /></S.ErrorLabel>
			}
			{
				isActive && <Dropdown
					list={options}
					ref={optionsRef}
					focusIndex={focusIndex}
					activeIndex={activeIndex}
					optionItemsRef={optionItemsRef}
					focusIndexHandler={focusIndexHandler}
					onClickItemHandler={onClickItemHandler}
					isMouseHoverAllowed={isMouseHoverAllowed}
					customDropdownStyles={customDropdownStyles}
					customDropdownItemStyles={customDropdownItemStyles}
					isMouseHoverAllowedHandler={isMouseHoverAllowedHandler}
				/>
			}
		</S.InputWpr>
	)
}

export default withKeyboardNavigation(Input)