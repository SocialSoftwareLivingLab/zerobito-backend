import { ApiProperty } from '@nestjs/swagger';
import { UsuarioAutenticadoDto } from './usuario-autenticado.dto';

export class LoginResponse {
  @ApiProperty({ description: 'Token JWT de autenticação do usuário' })
  token: string;

  @ApiProperty({ description: 'Dados do usuário autenticado na plataforma' })
  usuario: UsuarioAutenticadoDto;

  @ApiProperty({ description: "id do user logado "})
  id: number
}
