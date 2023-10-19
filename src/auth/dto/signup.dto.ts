import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { IsEmail, Length } from "class-validator"

export class SignupViaEmailDto {
	@ApiProperty({ default: "test1@test.com", required: true })
	@IsNotEmpty({ message: "Email should not be empty" })
	@IsEmail({}, { message: "Invalid email format" })
	email: string

	@ApiProperty({ default: "123456", maximum: 20, minimum: 6, required: true })
	@Length(6, 20, { message: "Password must be at least 6 characters long and upto 20 characters" })
	@IsNotEmpty({ message: "Password should not be empty" })
	password: string
}

export class VerifyEmailDto {
	@ApiProperty({ default: "test1@test.com", required: true })
	@IsNotEmpty({ message: "Email should not be empty" })
	@IsEmail({}, { message: "Invalid email format" })
	email: string

	@ApiProperty({ default: "123456", required: true })
	@IsNotEmpty({ message: "Verification code should not be empty" })
	@Length(6, 6, { message: "Verification code must be exactly 6 characters long" })
	code: string
}
