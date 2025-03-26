import { Controller, Post, Body, BadRequestException, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; storeName: string },
  ) {
    const { email, password, storeName } = body;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser !== null) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const user = await this.usersService.create(email, password, storeName);
    return { message: 'Usuario registrado', id: user.id };
  }

  // 👇 Nuevo endpoint protegido
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}
