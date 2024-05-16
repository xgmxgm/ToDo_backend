import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtModule } from "@nestjs/jwt"
import { UserController } from './user.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRETKEY,
      signOptions: { expiresIn: "60s" }
    })
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}