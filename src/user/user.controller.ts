import { Body, Controller, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { signInDto, signUpDto } from './user.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signin')
  @UsePipes(new ValidationPipe())
  async signIn(@Body() dto: signInDto) {
    return this.userService.signIn(dto);
  }
  
  @Post('signup')
  @UseInterceptors(FileInterceptor('avatarURL'))
  @UsePipes(new ValidationPipe())
  async signUp(@UploadedFile() file: Express.Multer.File, @Body() dto: signUpDto) {
    console.log("File: ",file)
    return this.userService.signUp(dto);
  }
}