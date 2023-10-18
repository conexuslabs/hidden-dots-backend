import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmptyString } from '@nestjsi/class-validator'
import { IsEmail, Length } from 'class-validator'

export class LoginDto {
	@ApiProperty({ default: 'test1@test.com', required: true })
	@IsNotEmptyString({ message: 'Email should not be empty' })
	@IsEmail({}, { message: 'Invalid email format' })
	email: string

	@ApiProperty({ default: '123456', maximum: 20, minimum: 6, required: true })
	@Length(6, 20, { message: 'Password must be at least 6 characters long and upto 20 characters' })
	@IsNotEmptyString({ message: 'Password should not be empty' })
	password: string
}
