import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { signInDto, signUpDto } from './user.dto';
import { UserService } from './user.service';

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

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    const validRefreshToken =
      await this.userService.verifyRefreshToken(refreshToken);
    if (validRefreshToken) {
      const payload = {
        username: validRefreshToken.username,
        sub: validRefreshToken.sub,
      };
      return this.userService.generateTokens(payload);
    }
  }
}
