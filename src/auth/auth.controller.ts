import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Post,
	Get,
	Request,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserResponseDto } from 'src/users/dto/user-response.dto'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { SignupViaEmailDto, VerifyEmailDto } from './dto/signup.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LocalAuthGuard } from './local-auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@UseInterceptors(ClassSerializerInterceptor)
	@Get('profile')
	getProfile(@Request() req: any) {
		return new UserResponseDto(req.user)
	}

	@Post('signup-via-email')
	async signup(@Body() body: SignupViaEmailDto) {
		return await this.authService.signup(body)
	}

	@Post('verify-email')
	async verifyEmail(@Body() body: VerifyEmailDto) {
		return await this.authService.verifyEmail(body)
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req: any, @Body() _body: LoginDto) {
		return this.authService.login(req.user)
	}
}
