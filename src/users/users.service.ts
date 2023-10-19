import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserDocument } from "src/schemas/user.schema"
import * as bcrypt from "bcrypt"
import { USER_ERRORS } from "./errors"
import { ForgotPasswordDto, UpdateUserPasswordDto } from "./dto/user.dto"
import { generateVerificationCode } from "src/common/utils"
import { AuthService } from "src/auth/auth.service"
import { SUCCESS_MESSAGES } from "src/common/successMessages"
import { AUTH_ERRORS } from "src/auth/errors"

@Injectable()
export class UsersService {
	private static HASH_ROUNDS = 10
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
		private readonly authService: AuthService,
	) {}

	findById(id: string) {
		return this.userModel.findById(id).lean().exec()
	}

	findOne(filters: Partial<User>) {
		return this.userModel.findOne(filters).lean().exec()
	}

	async create(user: User) {
		const createdUser = await new this.userModel(user).save()
		return createdUser.toObject()
	}

	async forgotPassword(payload: ForgotPasswordDto) {
		const { email } = payload

		const verificationCode = generateVerificationCode()
		const user = await this.userModel.findOneAndUpdate({ email }, { $set: { verificationCode } })
		if (!user) throw new NotFoundException(USER_ERRORS.NOT_FOUND)

		const codeSentSuccessfully = await this.authService.sendVerificationCode(email, verificationCode)
		if (codeSentSuccessfully) {
			return {
				successMessage: SUCCESS_MESSAGES.VERIFICATION_CODE_SENT_SUCCESSFULLY,
			}
		} else throw new BadRequestException(AUTH_ERRORS.FAILED_TO_SEND_EMAIL)
	}

	async updateUserPassword(id: string, user: UpdateUserPasswordDto) {
		const { newPassword, code } = user
		const hashedPassword = await bcrypt.hash(newPassword, UsersService.HASH_ROUNDS)
		const updatedUser = await this.userModel.findOneAndUpdate(
			{ _id: id, verificationCode: code },
			{ password: hashedPassword, $unset: { verificationCode: 1 } },
			{ new: true, lean: true },
		)

		if (!updatedUser) throw new NotFoundException(USER_ERRORS.NOT_FOUND)
		else return { ...updatedUser, successMessage: SUCCESS_MESSAGES.USER_PASSWORD_UPDATED }
	}
}
