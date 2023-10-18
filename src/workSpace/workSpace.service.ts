import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { WorkSpace, WorkSpaceDocument } from "src/schemas/workspace.schema"
import { CreateWorkSpaceDto, UpdateWorkSpaceDto } from "./dto/workSpace.dto"

@Injectable()
export class WorkSpaceService {
    constructor(@InjectModel(WorkSpace.name) private readonly workSpaceModel: Model<WorkSpaceDocument>) { }

    findById(id: string) {
        return this.workSpaceModel.findById(id).lean().exec()
    }

    async getByUser(userId: string) {
        return await this.workSpaceModel.find({ user: userId }).exec()
    }

    async update(id: string, ws: UpdateWorkSpaceDto) {
        const workSpace = await this.findById(id)
        if (!workSpace) throw new NotFoundException("WorkSpace Not Found")
        const updatedWorkSpace = await this.workSpaceModel.findByIdAndUpdate(id, ws, { new: true, lean: true })

        return { ...updatedWorkSpace, successMessage: "WorkSpace Updated Successfully" }
    }

    async delete(id: string) {
        const deletedWorkSpace = await this.workSpaceModel.findOneAndDelete({ _id: id })
        return deletedWorkSpace
    }

    async create(workSpace: CreateWorkSpaceDto) {
        const createWorkSpace = (await new this.workSpaceModel(workSpace).save()).toObject()

        return {
            ...createWorkSpace,
            successMessage: "Successfully Created",
        }
    }

}
