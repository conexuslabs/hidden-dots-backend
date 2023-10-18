import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({ timestamps: true, versionKey: false })
export class User {
	_id?: string

	@Prop()
	email: string

	@Prop()
	password: string

	@Prop()
	isVerified: boolean

	@Prop()
	verificationCode?: string
}

export type UserDocument = User & Document
export const UserSchema = SchemaFactory.createForClass(User)
