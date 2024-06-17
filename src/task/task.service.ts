import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDto, DeleteDto, completeDto } from './task.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TaskService {
	async getById(id: number) {
		const task = await prisma.task.findUnique({
			where: {
				id: id
			}
		});

		if (!task) throw new NotFoundException("Task not found!");

		return task;
	}

	async createTask(dto: CreateDto) {
		const task = {
			title: dto.title,
			description: dto.description,
			isComplete: false,
			authorId: dto.authorId,
		};

		const newTask = await prisma.task.create({
			data: {
				title: task.title,
				description: task.description,
				isComplete: task.isComplete,
				authorId: task.authorId,
			},
		});

		return newTask;
	}

	async deleteTask(dto: DeleteDto) {
		const task = await prisma.task.deleteMany({
			where: {
				id: {
					in: dto.ids
				}
			}
		})

		return task
	}

	async getAll() {
		const Tasks = await prisma.task.findMany();

		return Tasks;
	}

	async completeTask(dto: completeDto) {
		const task = await this.getById(dto.id);

		const updateTask = await prisma.task.update({
			where: {
				id: task.id
			},
			data: {
				isComplete: !task.isComplete
			}
		});

		return updateTask;
	}
}