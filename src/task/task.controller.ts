import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  CompleteDto,
  CompleteSubDto,
  CreateDto,
  CreateSubDto,
  DeleteDto,
  DeleteSubDto,
  EditDto,
  EditSubDto,
} from './task.dto';

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

  @Post('delete')
  @UsePipes(new ValidationPipe())
  async delete(@Body() dto: DeleteDto) {
    return this.taskService.deleteTask(dto);
  }

  @Post('delete-sub-task')
  @UsePipes(new ValidationPipe())
  async deleteSubTask(@Body() dto: DeleteSubDto) {
    return this.taskService.deleteSubTask(dto);
  }

  @Post('complete')
  @UsePipes(new ValidationPipe())
  async complete(@Body() dto: CompleteDto) {
    return this.taskService.completeTask(dto);
  }

  @Post('complete-sub-task')
  @UsePipes(new ValidationPipe())
  async completeSubTask(@Body() dto: CompleteSubDto) {
    return this.taskService.completeSubTask(dto);
  }

  @Post('edit/task')
  @UsePipes(new ValidationPipe())
  async editTask(@Body() dto: EditDto) {
    return this.taskService.editTask(dto);
  }
  
  @Post('edit/subtask')
  @UsePipes(new ValidationPipe())
  async editSubtask(@Body() dto: EditSubDto) {
    return this.taskService.editSubtask(dto);
  }

  @Get('get-tasks/:id')
  async getAll(@Param('id') id: string) {
    return this.taskService.getAll(id);
  }
}
