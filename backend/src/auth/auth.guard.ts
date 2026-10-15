import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export type AuthRequest = Request & { user: { id: number } };

// RN11: exige usuario autenticado
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) throw new UnauthorizedException();
    try {
      const payload = await this.jwt.verifyAsync<{ sub: number }>(token);
      req.user = { id: payload.sub };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
