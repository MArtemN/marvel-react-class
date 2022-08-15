import errorImg from './error.gif';

const ErrorMessage = () => {
	return (
		<>
			<img className='errorMessage' src={errorImg} alt='error-message'/>
		</>
	)
}

export default ErrorMessage;