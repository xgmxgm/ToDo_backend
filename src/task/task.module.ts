import { MiddlewareConsumer, Module } from '@nestjs/common'
import { TaskController } from './task.controller'
import { AuthMiddleware } from './task.middleware'
import { TaskService } from './task.service'

@Module({
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(TaskController)
  }
}