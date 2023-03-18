import styled from "@emotion/styled";

// Types
type DropdownItemProps = {
	isActive: boolean;
	isFocus: boolean;
	isMouseOn: boolean;
}

// Elements
const Dropdown = styled.ul`
	position: absolute;
	margin-top: 8px;
	max-height: 200px;
	overflow-y: auto;
	width: 100%;
	border: 1px #e7e7e7 solid;

	&::-webkit-scrollbar {
		width: 5px;
	}

	/* Track */
	&::-webkit-scrollbar-track {
		background-color: #e7e7e7;
	}

	/* Handle */
	&::-webkit-scrollbar-thumb {
		background-color: #757575;
	}
`

const DropdownItem = styled.li<DropdownItemProps>`
	padding: 12px 8px;
	font-size: 14px;
	line-height: 16px;
	background-color: white;
	${props => props.isMouseOn ? `pointer-events: auto;` : `pointer-events: none;`}
	${props => props.isFocus && `background-color: #badc58; color: #4a4a4a; font-weight: 900;`}
	${props => props.isActive && `background-color: #6ab04c; color: white; font-weight: 900;`}

	&:not(:last-child) {
		border-bottom: 1px #e7e7e7 solid;
	}
`

const Styled = {
	Dropdown,
	DropdownItem
}

export default Styled