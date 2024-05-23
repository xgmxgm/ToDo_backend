import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { error } from 'console'
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { signInDto, signUpDto } from './user.dto'

const prisma = new PrismaClient();

@Injectable()
export class UserService {
	constructor(
		private jwtService: JwtService
	) {}

	async getById(id: number) {
		const task = await prisma.task.findUnique({
			where: {
				id: id
			}
		})

		if (!task) throw new NotFoundException("Task not found!")

		return task
	}

	async signUp(dto: signUpDto) {
		try {
			const findUser = await prisma.user.findFirst({
				where: {
					email: dto.email
				}
			})

			if (findUser) {
				return {message: "User already exists!"}
			}

			const salt = await bcrypt.genSalt(10);
			const passwordHashing = await bcrypt.hash(dto.password, salt);

			const createUser = {
				fullName: dto.fullName,
				email: dto.email,
				passwordHash: passwordHashing,
				avatarURL: dto.avatarURL,
			}

			const newUser = await prisma.user.create({
				data: createUser,
			})

			const {passwordHash, ...user} = newUser;

			const token = {
				token: await this.jwtService.signAsync(user)
			}

			return token
		} catch (err) {
			console.error(err)
			throw new error("Failed sign up!")
		}
	}

	async signIn(dto: signInDto) {
		try {
			const findUser = await prisma.user.findFirst({
				where: {
					email: dto.email,
				},
				include: {
					Tasks: {}
				}
			})

			if (!findUser) return "Wrong login or password!"

			const isValidPass = await bcrypt.compare(dto.password, findUser.passwordHash);

			if (!isValidPass) return "Wrong login or password!"

			const {passwordHash, ...user} = findUser

			const User = {
				token: await this.jwtService.signAsync(user),
			}

			return User
		} catch (err) {
			console.error(err)
			throw new error("Failed sign in!")
		}
	}
}