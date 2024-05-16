import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator'

export class signUpDto {
	@IsString()
	fullName: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsOptional()
	@IsUrl()
	avatarURL: string;
}

export class signInDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;
}