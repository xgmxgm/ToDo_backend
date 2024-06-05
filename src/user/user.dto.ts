import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator'

export class signUpDto {
	@IsString()
	fullName: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsString()
	colorAvatar: string;
}

export class signInDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;
}