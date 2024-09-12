import { Injectable, NotFoundException } from '@nestjs/common'
import {
	CompleteDto,
	CompleteSubDto,
	CreateDto,
	CreateSubDto,
	DeleteDto,
	DeleteSubDto,
	EditDto,
	EditSubDto,
} from './task.dto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

@Injectable()
export class TaskService {
	async getById(id: number) {
		const task = await prisma.task.findUnique({
			where: {
				id: id,
			},
		})

		if (!task) throw new NotFoundException('Task not found!')

		return task
	}

	async getByAuthorId(authorId: number) {
		const tasks = await prisma.task.findMany({
			where: {
				authorId,
			},
			include: {
				subTasks: {},
			},
		})

		if (!tasks) throw new NotFoundException('Tasks not found!')

		return tasks
	}

	async getByIdSub(id: number) {
		const subTask = await prisma.subTask.findUnique({
			where: {
				id,
			},
		})

		if (!subTask) throw new NotFoundException('Subtask not found!')

		return subTask
	}

	async createTask(dto: CreateDto) {
		const task = {
			title: dto.title,
			isComplete: false,
			authorId: dto.authorId,
			subtasks: dto.subtasks
		}

		const newTask = await prisma.task.create({
			data: {
				title: task.title,
				isComplete: task.isComplete,
				authorId: task.authorId,
			},
		})
		
		for (const subtask of task.subtasks) {
			await prisma.subTask.create({
				data: {
					title: subtask.title,
					isComplete: false,
					taskId: newTask.id
				}
			})
		}

		return newTask
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
			},
		})

		return newSubTask
	}

	async deleteSubTask(dto: DeleteSubDto) {
		const subTask = await prisma.subTask.deleteMany({
			where: {
				id: dto.id,
			},
		})

		return subTask
	}

	async deleteTask(dto: DeleteDto) {
		await prisma.subTask.deleteMany({where: {taskId:dto.ids[0]}});

		const task = await prisma.task.deleteMany({
			where: {
				id: {
					in: dto.ids,
				},
			},
		})

		return task
	}

	async getAll(id: string) {
		const tasks = await this.getByAuthorId(+id)

		return tasks
	}

	async completeTask(dto: CompleteDto) {
		const task = await this.getById(dto.id)

		const updateTask = await prisma.task.update({
			where: {
				id: task.id,
			},
			data: {
				isComplete: !task.isComplete,
			},
		})

		return updateTask
	}

	async completeSubTask(dto: CompleteSubDto) {
		const subTask = await this.getByIdSub(dto.id)

		const updateSubTask = await prisma.subTask.update({
			where: {
				id: subTask.id,
			},
			data: {
				isComplete: !subTask.isComplete,
			},
		})

		return updateSubTask
	}

	async editTask(dto: EditDto) {
		const task = await this.getById(dto.id)

		const changedTask = await prisma.task.update({
			where: {
				id: task.id
			},
			data: {
				title: dto.title
			}
		})

		return changedTask
	}
	
	async editSubtask(dto: EditSubDto) {
		const subtask = await this.getByIdSub(dto.id)

		const changedSubtask = await prisma.subTask.update({
			where: {
				id: subtask.id
			},
			data: {
				title: dto.title
			}
		})

		return changedSubtask
	}
}
