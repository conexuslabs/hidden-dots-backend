import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { User } from "./user.schema"

@Schema({ timestamps: true })
export class WorkSpace {
    @Prop()
    name: string

    @Prop()
    address: string

    @Prop()
    mobile: string

    @Prop()
    email: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    user: User
}

export type WorkSpaceDocument = WorkSpace & Document
export const WorkSpaceSchema = SchemaFactory.createForClass(WorkSpace)
