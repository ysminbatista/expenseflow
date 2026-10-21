import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard, type AuthRequest } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './dto.js';

// Limite de tentativas de login/cadastro por IP a cada minuto, para dificultar
// ataques de forca bruta (tentar senhas em sequencia).
const AUTH_LIMIT = {
  default: {
    ttl: 60_000,
    limit: () => Number(process.env.AUTH_THROTTLE_LIMIT ?? 5),
  },
};

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @Throttle(AUTH_LIMIT)
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @Throttle(AUTH_LIMIT)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: AuthRequest) {
    return this.auth.me(req.user.id);
  }
}
