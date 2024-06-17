import { IsArray, IsNumber, IsString } from 'class-validator'

export class CreateDto {
	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsNumber()
	authorId: number;
}

export class DeleteDto {
	@IsArray()
	ids: number[];
}

export class completeDto {
	@IsNumber()
	id: number;
}