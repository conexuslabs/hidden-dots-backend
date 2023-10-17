import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { SignupViaEmailDto } from './dto/signup.dto'
import * as bcrypt from 'bcrypt'
import { UserDocument } from 'src/schemas/user.schema'
import { JwtService } from '@nestjs/jwt'
import { AUTH_ERRORS } from './errors'
import * as nodemailer from 'nodemailer'
import { ConfigService } from 'src/config/config.service'
import { warn } from 'console'

@Injectable()
export class AuthService {
	private transporter
	private static HASH_ROUNDS = 10

	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: this.configService.serverEmail,
				pass: this.configService.serverPassword,
			},
		})
	}

	async signup(credentials: SignupViaEmailDto) {
		const { email, password } = credentials
		const existingUser = await this.usersService.findOne({ email })
		if (existingUser) throw new BadRequestException(AUTH_ERRORS.USER_EMAIL_ALREADY_EXIST)

		const hashedPassword = await bcrypt.hash(password, AuthService.HASH_ROUNDS)
		const verificationCode = this.generateVerificationCode()

		await this.usersService.create({
			email,
			password: hashedPassword,
			isVerified: false,
			verificationCode,
		})

		return await this.sendVerificationCode(email, verificationCode)
	}

	async validateUser({ email, password }: { email: string; password: string }) {
		const user = await this.usersService.findOne({ email })
		if (!user) return null
		const { password: hashedPassword, ...rest } = user
		const match = await bcrypt.compare(password, hashedPassword)
		if (!match) return null

		return rest
	}

	async login(user: UserDocument) {
		const payload = { username: user.email, sub: user._id }
		return {
			token: this.jwtService.sign(payload),
		}
	}

	async sendVerificationCode(email: string, verificationCode: string) {
		const mailOptions = {
			from: this.configService.serverPassword,
			to: email,
			subject: 'Verification Code',
			text: `Your verification code is: ${verificationCode}`,
		}

		this.transporter.sendMail(mailOptions, error => {
			if (error) {
				console.log('error', error)
				return new BadRequestException('Failed to send email.')
			} else {
				return {
					successMessage: `Verification code has been successfully sent to you email`,
				}
			}
		})
	}

	private generateVerificationCode() {
		const min = 100000 // Minimum 6-digit number
		const max = 999999 // Maximum 6-digit number
		const verificationCode = Math.floor(Math.random() * (max - min + 1)) + min
		return verificationCode.toString()
	}
}
