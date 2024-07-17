import { IsArray, IsNumber, IsString } from 'class-validator'

export class CreateDto {
	@IsString()
	title: string

	@IsNumber()
	authorId: number
}

export class CreateSubDto {
	@IsString()
	title: string

	@IsNumber()
	taskId: number
}

export class DeleteDto {
	@IsArray()
	ids: number[]
}

export class DeleteSubDto {
	@IsNumber()
	id: number
}

export class CompleteDto {
	@IsNumber()
	id: number
}

export class CompleteSubDto {
	@IsNumber()
	id: number
}
