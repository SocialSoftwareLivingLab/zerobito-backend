import { PERFIL_KEY } from '@/app/usuarios/decorators/perfil.decorator';
import { PerfilUsuario } from '@/app/usuarios/enums/perfil-usuario.enum';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsuarioAutenticadoDto } from '../dtos/usuario-autenticado.dto';

@Injectable()
export class PerfilGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const perfisNecessarios = this.reflector.getAllAndOverride<PerfilUsuario[]>(
      PERFIL_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!perfisNecessarios) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UsuarioAutenticadoDto;

    // usuários administradores do sistema podem fazer tudo...
    if (user.perfil.codigo === PerfilUsuario.ROOT) {
      return true;
    }

    if (this.ehPermissaoUserParaQualquerPerfil(user, perfisNecessarios)) {
      return true;
    }

    return perfisNecessarios.some((perfil) => user.perfil.codigo === perfil);
  }

  private ehPermissaoUserParaQualquerPerfil(
    user: UsuarioAutenticadoDto,
    perfisNecessarios: PerfilUsuario[],
  ) {
    return (
      user.perfil.codigo !== PerfilUsuario.USER &&
      perfisNecessarios.includes(PerfilUsuario.USER)
    );
  }
}
