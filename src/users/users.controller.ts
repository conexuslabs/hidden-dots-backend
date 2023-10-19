import { Body, ClassSerializerInterceptor, Controller, Param, Put, UseGuards, UseInterceptors } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { UserResponseDto } from "./dto/user-response.dto"
import { ForgotPasswordDto, GetUserDto, UpdateUserPasswordDto } from "./dto/user.dto"
import { UsersService } from "./users.service"

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Put("/forgot-password")
	forgotPassword(@Body() body: ForgotPasswordDto) {
		return this.usersService.forgotPassword(body)
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Put("update-password/:id")
	async update(@Param() params: GetUserDto, @Body() body: UpdateUserPasswordDto) {
		const updatedUser = await this.usersService.updateUserPassword(params.id, body)
		return new UserResponseDto(updatedUser)
	}
}
