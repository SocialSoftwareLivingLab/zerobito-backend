import { ApiProperty } from '@nestjs/swagger';

export class LocalOcorrenciaDto {
  @ApiProperty({ description: 'Cidade da ocorrência', example: 'São Paulo' })
  cidade: string;

  @ApiProperty({ description: 'Estado da ocorrência', example: 'SP' })
  estado: string;

  @ApiProperty({
    description: 'Logradouro da ocorrência',
    example: 'Av. Paulista',
  })
  logradouro: string;
}
