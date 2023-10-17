import { Injectable } from '@nestjs/common'
import * as dotenv from 'dotenv'
import * as Joi from 'joi'
import ConfigInterface from './types/Config.type'
@Injectable()
export class ConfigService {
	private readonly config: ConfigInterface

	constructor() {
		dotenv.config()
		this.config = this.validateConfig(process.env as { [key: string]: string })
	}

	private validateConfig(config: any): ConfigInterface {
		const schema = Joi.object({
			MONGODB_URI: Joi.string().required(),
			PORT: Joi.number().default(8081),
			SERVER_EMAIL: Joi.string().required(),
			SERVER_PASSWORD: Joi.string().required(),
		})
		const { error, value } = schema.validate(config, {
			abortEarly: false,
			allowUnknown: true,
		})
		if (error) {
			throw new Error(`Config validation error: ${error.message}`)
		}

		return value
	}

	get mongodbURI(): string {
		return this.config.MONGODB_URI
	}

	get port(): number {
		return this.config.PORT
	}

	get jwtSecret(): string {
		return this.config.SECRET
	}

	get serverEmail(): string {
		return this.config.SERVER_EMAIL
	}
	get serverPassword(): string {
		return this.config.SERVER_PASSWORD
	}
}
