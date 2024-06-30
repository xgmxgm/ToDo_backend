import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDto, CreateSubDto, DeleteDto, DeleteSubDto, completeDto } from './task.dto';
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
			isComplete: false,
			authorId: dto.authorId,
		};

		const newTask = await prisma.task.create({
			data: {
				title: task.title,
				isComplete: task.isComplete,
				authorId: task.authorId,
			},
		});

		return newTask;
	}

	async createSubTask(dto: CreateSubDto) {
		const subTask = {
			title: dto.title,
			isComplete: false,
			taskId: dto.taskId,
		}

		const newSubTask = await prisma.subTask.create({
			data: {
				title: subTask.title,
				isComplete: subTask.isComplete,
				taskId: subTask.taskId,
			}
		})

		return newSubTask;
	}

	async deleteSubTask(dto: DeleteSubDto) {
		const subTask = await prisma.subTask.deleteMany({
			where: {
				id: dto.id
			}
		})

		return subTask
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