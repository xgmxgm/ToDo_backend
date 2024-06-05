import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { signInDto, signUpDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signin')
  @UsePipes(new ValidationPipe())
  async signIn(@Body() dto: signInDto) {
    return this.userService.signIn(dto);
  }
  
  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signUp(@Body() dto: signUpDto) {
    return this.userService.signUp(dto);
  }
}