import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, type AuthRequest } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: AuthRequest) {
    return this.auth.me(req.user.id);
  }
}
