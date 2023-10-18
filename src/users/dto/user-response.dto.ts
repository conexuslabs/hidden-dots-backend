import { Exclude, Transform } from 'class-transformer'

export class UserResponseDto {
	@Exclude()
	password: string

	@Transform(value => {
		return value.value.toString()
	})
	_id: string | unknown

	constructor(partial: Partial<UserResponseDto>) {
		Object.assign(this, partial)
	}
}
