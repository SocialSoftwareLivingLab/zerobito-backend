import { UsuariosService } from '@/app/usuarios/usuarios.service';
import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Perfil } from './decorators/perfil.decorator';
import {
  CriarUsuarioRequestDto,
  CriarUsuarioResponseDto,
} from './dtos/criar-usuario.dto';
import { PerfilUsuario } from './enums/perfil-usuario.enum';

@ApiBearerAuth()
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
  @Protegido()
  @Perfil(PerfilUsuario.ADMIN)
  public async adicionar(
    @Body() body: CriarUsuarioRequestDto,
  ): Promise<CriarUsuarioResponseDto> {
    const { id, nome, email, dataCriacao } =
      await this.usuarioService.adicionar(body, PerfilUsuario.USER);

    return { id, nome, email, dataCriacao };
  }
}
