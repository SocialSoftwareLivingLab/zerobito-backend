import { UsuariosService } from '@/app/usuarios/usuarios.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CriarUsuarioRequestDto,
  CriarUsuarioResponseDto,
} from './dtos/criar-usuario.dto';
import { PerfilUsuario } from './enums/perfil-usuario.enum';

// TODO: Adicionar funcionalidade de cadastro quando o admin conseguir criar usuários na plataforma
// @ApiBearerAuth()
@ApiTags('Usuarios')
@Controller('/api/v1/usuarios')
export class UsuariosController {
  constructor(private readonly usuarioService: UsuariosService) {}

  @Post()
  @ApiOperation({
    description: 'Adiciona um novo usuário na plataforma',
    summary: 'Adicionar novo usuário',
  })
  @ApiCreatedResponse({
    type: CriarUsuarioResponseDto,
    description: 'Usuário criado',
  })
  // @Protegido()
  // @Perfil(PerfilUsuario.ADMIN)
  public async adicionar(
    @Body() body: CriarUsuarioRequestDto,
  ): Promise<CriarUsuarioResponseDto> {
    const { id, nome, email, dataCriacao } =
      await this.usuarioService.adicionar(body, PerfilUsuario.USER);

    return { id, nome, email, dataCriacao };
  }
}
