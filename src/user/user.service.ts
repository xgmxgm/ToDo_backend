import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { signInDto, signUpDto } from './user.dto';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}

  async signUp(dto: signUpDto) {
    const findUser = await prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (findUser) throw new BadRequestException('User already exists!');

    const salt = await bcrypt.genSalt(10);
    const passwordHashing = await bcrypt.hash(dto.password, salt);

    const createUser = {
      fullName: dto.fullName,
      email: dto.email,
      passwordHash: passwordHashing,
      colorAvatar: dto.colorAvatar,
    };

    const newUser = await prisma.user.create({
      data: createUser,
    });

    const { passwordHash, ...user } = newUser;
    const { colorAvatar, fullName, ...dataToken } = user;

    const User = {
      ...user,
      accessToken: (await this.generateTokens(dataToken)).accessToken,
      refreshToken: (await this.generateTokens(dataToken)).refreshToken,
    };

    return User;
  }

  async signIn(dto: signInDto) {
    const findUser = await prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!findUser) throw new NotFoundException('Wrong email or password!');

    const isValidPass = await bcrypt.compare(
      dto.password,
      findUser.passwordHash,
    );

    if (!isValidPass) throw new NotFoundException('Wrong email or password!');

    const { passwordHash, ...user } = findUser;
    const { colorAvatar, fullName, ...dataToken } = user;

    const User = {
      ...user,
      accessToken: (await this.generateTokens(dataToken)).accessToken,
      refreshToken: (await this.generateTokens(dataToken)).refreshToken,
    };

    return User;
  }

  async generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.SECRETKEY,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESHKEY,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: process.env.SECRETKEY });
    } catch (err) {
      throw new UnauthorizedException('Invalid access token !');
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: process.env.REFRESHKEY });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
