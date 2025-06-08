import { PERMISSAO_KEY } from '@/app/usuarios/decorators/permissao.decorator';
import { PermissaoEnum } from '@/app/usuarios/enums/permissoes.enum';
import { PerfisService } from '@/app/usuarios/services/perfis.service';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissaoGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private perfisService: PerfisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissaoEnum[]
    >(PERMISSAO_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UsuarioAutenticadoDto = request.user;

    if (!user || !user.perfil) {
      return false;
    }

    // Usar dados do perfil do JWT se disponíveis
    if (user.perfil?.permissoes) {
      for (const permission of requiredPermissions) {
        if (user.perfil.permissoes.includes(permission)) {
          return true;
        }
      }
      return false;
    }

    return false;
  }
}
