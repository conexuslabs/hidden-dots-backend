import {
    Body,
    Param,
    Controller,
    Post,
    Delete,
    Get,
    Put,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { WorkSpaceService } from "./workSpace.service"
import { CreateWorkSpaceDto, GetWorkSpaceDto, GetWorkSpaceInformationDto, UpdateWorkSpaceDto } from './dto/workSpace.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@ApiTags('WorkSpace')
@Controller('workSpace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class WrokSpaceController {
    constructor(private readonly workSpaceService: WorkSpaceService) { }

    @Post("details")
    async create(@Body() body: CreateWorkSpaceDto) {
        const workSpace = await this.workSpaceService.create(body)
        return workSpace
    }

    @Put("/:workSpaceId")
    updateWorkSpaceDetail(
        @Param() params: GetWorkSpaceDto,
        @Body() body: UpdateWorkSpaceDto,
    ) {
        return this.workSpaceService.update(params.workSpaceId, body)
    }

    @Delete("/:workSpaceId")
    deleteWorkSpace(
        @Param() params: GetWorkSpaceDto) {
        return this.workSpaceService.delete(params.workSpaceId)
    }

    @Get("user/:userId")
    async findWorkSpaceByUser(@Param() params: GetWorkSpaceInformationDto) {
        const workSpace = await this.workSpaceService.getByUser(params.userId)
        return workSpace
    }
}


