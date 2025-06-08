import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSAO_KEY } from '../decorators/permissao.decorator';
import { PerfisService } from '../services/perfis.service';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';

@Injectable()
export class PermissaoGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private perfisService: PerfisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSAO_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UsuarioAutenticadoDto = request.user;

    if (!user || !user.perfil) {
      return false;
    }

    // Buscar o perfil do usuário para obter o ID
    const perfilOptional = await this.perfisService.buscarPerfilPorCodigo(
      user.perfil,
    );
    if (!perfilOptional.isPresent()) {
      return false;
    }

    const perfil = perfilOptional.get();

    // Verificar se o usuário tem pelo menos uma das permissões requeridas
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
