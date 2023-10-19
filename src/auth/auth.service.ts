import { Model } from "mongoose"
import * as bcrypt from "bcrypt"
import * as nodemailer from "nodemailer"
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common"
import { UsersService } from "src/users/users.service"
import { SignupViaEmailDto, VerifyEmailDto } from "./dto/signup.dto"
import { User, UserDocument } from "src/schemas/user.schema"
import { JwtService } from "@nestjs/jwt"
import { AUTH_ERRORS } from "./errors"
import { ConfigService } from "src/config/config.service"
import { InjectModel } from "@nestjs/mongoose"
import { SUCCESS_MESSAGES } from "src/common/successMessages"
import { generateVerificationCode } from "src/common/utils"

@Injectable()
export class AuthService {
	private transporter
	private static HASH_ROUNDS = 10

	constructor(
		@Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
	) {
		this.transporter = nodemailer.createTransport({
			host: "smtp.titan.email",
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
		const verificationCode = generateVerificationCode()

		await this.usersService.create({
			email,
			password: hashedPassword,
			isVerified: false,
			verificationCode,
		})

		const codeSentSuccessfully = await this.sendVerificationCode(email, verificationCode)

		if (codeSentSuccessfully) {
			return {
				successMessage: SUCCESS_MESSAGES.VERIFICATION_CODE_SENT_SUCCESSFULLY,
			}
		} else throw new BadRequestException(AUTH_ERRORS.FAILED_TO_SEND_EMAIL)
	}

	async validateUser({ email, password }: { email: string; password: string }) {
		const user = await this.usersService.findOne({ email })
		if (!user) return null
		const { password: hashedPassword, ...rest } = user
		const match = await bcrypt.compare(password, hashedPassword)
		if (!rest.isVerified) return null
		if (!match) return null

		return rest
	}

	async login(user: Partial<UserDocument>) {
		const payload = { username: user.email, sub: user._id }
		return {
			token: this.jwtService.sign(payload),
			successMessage: SUCCESS_MESSAGES.LOGGED_IN_SUCCESS,
		}
	}

	async sendVerificationCode(email: string, verificationCode: string) {
		const mailOptions = {
			from: this.configService.serverEmail,
			to: email,
			subject: "Verification Code",
			text: `Your verification code is: ${verificationCode}`,
		}
		try {
			await this.transporter.sendMail(mailOptions)
			return true
		} catch (error) {
			console.error("error", error)
			return false
		}
	}

	async verifyEmail(params: VerifyEmailDto) {
		const { code, email } = params
		const unVerifiedUserFoundAndUpdated = await this.userModel.findOneAndUpdate(
			{ email, verificationCode: code },
			{ $set: { isVerified: true }, $unset: { verificationCode: 1 } },
			{ new: true, lean: true },
		)

		if (!unVerifiedUserFoundAndUpdated) throw new BadRequestException(AUTH_ERRORS.EMAIL_OR_CODE_IS_WRONG)
		else {
			return this.login(unVerifiedUserFoundAndUpdated)
		}
	}
}
