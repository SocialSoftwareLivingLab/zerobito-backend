import { PERMISSAO_CASO_KEY } from '@/app/casos/decorators/permissao-caso.decorator';
import { UsuarioPerfilService } from '@/app/usuario-perfil/entities/usuario-perfil.service';
import { PermissaoEnum } from '@/app/usuarios/enums/permissoes.enum';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissaoCasoGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private casosPermissaoService: UsuarioPerfilService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verificar se há permissões de caso requeridas
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissaoEnum[]
    >(PERMISSAO_CASO_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UsuarioAutenticadoDto = request.user;

    if (!user) {
      return false;
    }

    // Extrair ID do caso da URL (padrão: /casos/:idCaso/...)
    const idCaso = this.extrairIdCaso(request);

    if (!idCaso) {
      return false;
    }

    // Buscar todas as permissões do usuário no caso uma única vez
    const permissoesUsuario =
      await this.casosPermissaoService.obterPermissoesUsuarioNoCaso(
        user.id,
        idCaso,
      );

    // Verificar se o usuário tem pelo menos uma das permissões necessárias
    return requiredPermissions.some((permission) =>
      permissoesUsuario.includes(permission),
    );
  }

  private extrairIdCaso(request: any): number | null {
    // Tentar extrair de diferentes posições dos parâmetros
    const idCaso = request.params?.idCaso || request.params?.id;

    if (!idCaso || isNaN(Number(idCaso))) {
      return null;
    }

    return Number(idCaso);
  }
}
