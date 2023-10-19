export const generateVerificationCode = () => {
	const min = 100000 // Minimum 6-digit number
	const max = 999999 // Maximum 6-digit number
	const verificationCode = Math.floor(Math.random() * (max - min + 1)) + min
	return verificationCode.toString()
}
