import styled from "@emotion/styled"

type InputItemProps = {
	isActive: boolean;
}

const Input = styled.input<InputItemProps>`
	padding: 0px 30px 0px 12px;
	height: 48px;
	width: 100%;
	font-size: 16px;
	line-height: 20px;
	border-radius: 4px;
	border: 2px #d8d8d8 solid;

	${props => props.isActive && `
		border: 2px #3498db solid;
		outline: none;
	`}
`

const InputWpr = styled.div`
	position: relative;
	/* width: 400px; */
`

const InputCtr = styled.div`
	position: relative;
	/* isActive: */
	/* isFocus: */
	/* isError: */
`

const IconCtr = styled.div`
	position: absolute;
	top: 55%;
	transform: translateY(-50%);
	right: 12px;
`

const ErrorLabel = styled.p``

const Styled = {
	Input,
	InputWpr,
	ErrorLabel,
	InputCtr,
	IconCtr
}

export default Styled
