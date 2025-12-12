import { PROTEGIDO_KEY } from '@/auth/decorators/protegido.decorator';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtGuard } from './jwt-auth.guard';

@Injectable()
export class ProtegidoGuard implements CanActivate {
  private readonly logger = new Logger(ProtegidoGuard.name);
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtGuard: JwtGuard,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (!this.reflector) {
      return true;
    }

    const isSecured = this.reflector.getAllAndOverride<boolean>(PROTEGIDO_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isSecured) {
      return true;
    }

    return this.jwtGuard.canActivate(context);
  }
}
