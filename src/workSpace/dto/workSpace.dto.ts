import { ApiProperty, PartialType } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsMongoId, IsEmail, IsOptional } from "class-validator"
import { Transform } from "class-transformer"

export class GetWorkSpaceDto {
    @ApiProperty({ default: "", description: "WorkSpace ID" })
    @IsMongoId()
    workSpaceId: string
}

export class GetWorkSpaceInformationDto {
    @ApiProperty({ default: "", description: "User ID" })
    @IsMongoId()
    userId: string
}


export class CreateWorkSpaceDto {
    @ApiProperty({ default: "" })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ default: "" })
    @IsMongoId()
    user: string


    @ApiProperty({ default: "" })
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    @IsOptional()
    email: string

    @ApiProperty({ default: "" })
    @IsString()
    @IsOptional()
    address: string

    @ApiProperty({ default: "" })
    @IsString()
    @IsOptional()
    mobile: string
}

export class FilterWorkSpaceDto extends PartialType(CreateWorkSpaceDto) { }

export class UpdateWorkSpaceDto extends PartialType(CreateWorkSpaceDto) { }

