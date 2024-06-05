import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { signInDto, signUpDto } from './user.dto'

const prisma = new PrismaClient();

@Injectable()
export class UserService {
	constructor(
		private jwtService: JwtService
	) {}

	async signUp(dto: signUpDto) {
		const findUser = await prisma.user.findFirst({
			where: {
				email: dto.email
			}
		})

		if (findUser) throw new BadRequestException("User already exists!");

		const salt = await bcrypt.genSalt(10);
		const passwordHashing = await bcrypt.hash(dto.password, salt);

		const createUser = {
			fullName: dto.fullName,
			email: dto.email,
			passwordHash: passwordHashing,
			colorAvatar: dto.colorAvatar,
		}

		const newUser = await prisma.user.create({
			data: createUser,
		})

		const {passwordHash, ...user} = newUser;

		const token = {
			token: await this.jwtService.signAsync(user)
		}

		return token
	}

	async signIn(dto: signInDto) {
		const findUser = await prisma.user.findFirst({
			where: {
				email: dto.email,
			},
			include: {
				Tasks: {}
			}
		});

		if (!findUser) throw new NotFoundException("Wrong email or password!");

		const isValidPass = await bcrypt.compare(dto.password, findUser.passwordHash);

		if (!isValidPass) throw new NotFoundException("Wrong email or password!");

		const { passwordHash, ...user } = findUser

		const User = {
			token: await this.jwtService.signAsync(user),
		}

		return User
	}
}