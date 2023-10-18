import { Module } from "@nestjs/common"
import { WorkSpaceService } from "./workSpace.service"
import { WorkSpaceController } from "./workSpace.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { WorkSpace, WorkSpaceSchema } from "src/schemas/workspace.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: WorkSpace.name, schema: WorkSpaceSchema }])],
    controllers: [WorkSpaceController],
    providers: [WorkSpaceService],
    exports: [WorkSpaceService],
})
export class WorkSpaceModule { }
