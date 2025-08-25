import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class AtribuirPerfilMembroRequest {
  @ApiProperty({
    description: 'ID do perfil a ser atribuído ao membro',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  idPerfil: number;
}
