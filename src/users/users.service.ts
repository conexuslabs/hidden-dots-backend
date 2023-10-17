import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from 'src/schemas/user.schema'

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

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
}
