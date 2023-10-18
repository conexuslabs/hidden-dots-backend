import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigService } from './config/config.service'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { WorkSpaceModule } from './workSpace/workSpace.module'
@Module({
	imports: [
		ConfigModule,
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.mongodbURI,
			}),
		}),
		AuthModule,
		UsersModule,
		WorkSpaceModule
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
