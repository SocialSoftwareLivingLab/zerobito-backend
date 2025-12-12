import { UsuarioPerfilService } from '@/app/usuario-perfil/entities/usuario-perfil.service';
import { PERMISSAO_KEY } from '@/app/usuarios/decorators/permissao.decorator';
import { PermissaoEnum } from '@/app/usuarios/enums/permissoes.enum';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissaoGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly usuarioPerfilService: UsuarioPerfilService) {}
  private readonly logger = new Logger(PermissaoGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissaoEnum[]
    >(PERMISSAO_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UsuarioAutenticadoDto = request.user;


    if (!user) {
      this.logger.log(user);
      return false;
    }

    const perfis = await this.usuarioPerfilService.listarPerfisDoUsuario(user.id);

    const permissoes = perfis.flatMap((up) => up.perfil.permissoes.map((p) => p.codigo));

    this.logger.log(user.perfis);

    // Checa se algum dos requiredPermissions está nas permissoes do usuário
    const possuiPermissao = requiredPermissions.some((perm) =>
      permissoes.includes(perm),
    );

    return possuiPermissao;
  }

}
