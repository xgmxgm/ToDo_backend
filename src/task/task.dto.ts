import { IsArray, IsNumber, IsString } from 'class-validator'

export class CreateDto {
	@IsString()
	description: string;
}

export class DeleteDto {
	@IsArray()
	ids: number[];
}

export class completeDto {
	@IsNumber()
	id: number;
}