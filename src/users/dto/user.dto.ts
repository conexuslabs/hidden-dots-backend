import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsMongoId, IsNotEmpty, Length } from "class-validator"

export class GetUserDto {
	@ApiProperty({ default: "", description: "This should be mongodb id" })
	@IsMongoId()
	@IsNotEmpty({ message: "Id should not be empty" })
	id: string
}

export class UpdateUserPasswordDto {
	@ApiProperty({
		default: "123456",
		maximum: 20,
		minimum: 6,
		required: true,
		description: "Password must be at least 6 characters long and upto 20 characters",
	})
	@Length(6, 20, { message: "Password must be at least 6 characters long and upto 20 characters" })
	@IsNotEmpty({ message: "Password should not be empty" })
	newPassword: string

	@ApiProperty({ default: "123456", required: true })
	@IsNotEmpty({ message: "Verification code should not be empty" })
	@Length(6, 6, { message: "Verification code must be exactly 6 characters long" })
	code: string
}

export class ForgotPasswordDto {
	@ApiProperty({ default: "test1@test.com", required: true })
	@IsNotEmpty({ message: "Email should not be empty" })
	@IsEmail({}, { message: "Invalid email format" })
	email: string
}
