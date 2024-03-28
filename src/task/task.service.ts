import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDto, DeleteDto, completeDto } from './task.dto'
import { PrismaClient } from '@prisma/client'
import { error } from 'console'

const prisma = new PrismaClient();

@Injectable()
export class TaskService {
	async getById(id: number) {
		const task = await prisma.task.findUnique({
			where: {
				id: id
			}
		})

		if (!task) throw new NotFoundException("Task not found!")

		return task
	}

	async createTask(dto: CreateDto) {
		try {
			const task = {
				isComplete: false,
				description: dto.description,
			}

			const newTask = await prisma.task.create({
				data: task,
			})

			return newTask
		} catch(err) {
			console.error(err)
			throw new error("Failed create task!")
		}
	}

	async deleteTask(dto: DeleteDto) {
		try {
			const task = await prisma.task.deleteMany({
				where: {
					id: {
						in: dto.ids
					}
				}
			})

			return task
		} catch(err) {
			console.error(err)
			throw new error("Failed delete task!")
		}
	}

	async getAll() {
		try {
			const Tasks = await prisma.task.findMany()

			return Tasks
		} catch(err) {
			console.error(err)
			throw new error("Failed get tasks!")
		}
	}

	async completeTask(dto: completeDto) {
		try {
			const task = await this.getById(dto.id)

			const updateTask = await prisma.task.update({
				where: {
					id: task.id
				},
				data: {
					isComplete: !task.isComplete
				}
			})
	
			return updateTask;
		} catch (err) {
			console.error(err)
			throw new error("Failed complete task!")
		}
	}
}