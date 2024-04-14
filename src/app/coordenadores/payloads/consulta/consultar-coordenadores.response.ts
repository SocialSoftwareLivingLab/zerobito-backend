import { ApiProperty } from '@nestjs/swagger';

export default class ConsultarCoordenadoresResponseDto {
  @ApiProperty({ description: 'ID do coordenador' })
  id: number;

  @ApiProperty({ description: 'Nome do coordenador' })
  nome: string;

  @ApiProperty({ description: 'Email do coordenador' })
  email: string;

  @ApiProperty({ description: 'Data de criação do coordenador' })
  dataCriacao: Date;
}
