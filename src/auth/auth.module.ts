import { forwardRef, Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { UsersModule } from "src/users/users.module"
import { PassportModule } from "@nestjs/passport"
import { LocalStrategy } from "./local.strategy"
import { JwtModule } from "@nestjs/jwt"
import { ConfigService } from "src/config/config.service"
import { JwtStrategy } from "./jwt.strategy"
import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from "src/schemas/user.schema"

@Module({
	imports: [
		forwardRef(() => UsersModule),
		PassportModule,
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.jwtSecret,
				// signOptions: { expiresIn: '10 days' },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
