import { Body, Controller, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { signInDto, signUpDto } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  @Post('upload')
  @UseInterceptors(FileInterceptor('avatarURL', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callBack) => {
        const name = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.')[1];
        const newFileName = name.split(' ').join('_') + '_' + Date.now() + "." + fileExtension;

        callBack(null, newFileName);
      }
    }),
    fileFilter: (req, file, callBack) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        callBack(null, false);
      }
      callBack(null, true);
    }
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log("file: ", file)
    return file
  }
}