import { ApiProperty } from '@nestjs/swagger';

export class UsuarioApiResponse {
  @ApiProperty({ description: 'ID do usuário' })
  id: number;

  @ApiProperty({ description: 'Nome do usuário' })
  nome: string;

  @ApiProperty({ description: 'E-mail do usuário' })
  email: string;
}
