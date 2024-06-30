import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateDto, CreateSubDto, DeleteDto, DeleteSubDto, completeDto } from './task.dto'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateDto) {
    return this.taskService.createTask(dto);
  }

  @Post('create-sub-task')
  @UsePipes(new ValidationPipe())
  async createSubTask(@Body() dto: CreateSubDto) {
    return this.taskService.createSubTask(dto);
  }

  @Post('delete-sub-task')
  @UsePipes(new ValidationPipe())
  async deleteSubTask(@Body() dto: DeleteSubDto) {
    return this.taskService.deleteSubTask(dto);
  }

  @Post('delete')
  @UsePipes(new ValidationPipe())
  async delete(@Body() dto: DeleteDto) {
    return this.taskService.deleteTask(dto);
  }

  @Get('get-tasks')
  async getAll() {
    return this.taskService.getAll();
  }

  @Post('complete')
  @UsePipes(new ValidationPipe())
  async complete(@Body() dto: completeDto) {
    return this.taskService.completeTask(dto);
  }
}