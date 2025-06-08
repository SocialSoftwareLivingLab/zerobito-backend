import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSAO_KEY } from '../decorators/permissao.decorator';
import { PerfisService } from '../services/perfis.service';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { PermissaoEnum } from '../enums/permissoes.enum';

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

    // Fallback: buscar no banco de dados
    const perfilOptional = await this.perfisService.buscarPerfilPorCodigo(
      user.perfil.codigo,
    );
    if (!perfilOptional.isPresent()) {
      return false;
    }

    const perfil = perfilOptional.get();

    for (const permission of requiredPermissions) {
      const hasPermission = await this.perfisService.verificarPermissao(
        perfil.id,
        permission,
      );
      if (hasPermission) {
        return true;
      }
    }

    return false;
  }
}
