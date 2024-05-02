import { ApiProperty } from '@nestjs/swagger';
import { CondicaoVitimaOcorrenciaEnum } from '../../enums/condicao-vitima-ocorrencia.enum';

export class VitimaDto {
  @ApiProperty({ description: 'Nome da vítima', example: 'João da Silva' })
  nome: string;

  @ApiProperty({
    description: 'Vínculo da vítima com a empresa',
    example: 'Operário de Máquina',
  })
  vinculo: string;

  @ApiProperty({
    description: 'Condição da vítima',
    example: 'OBITO',
    enum: CondicaoVitimaOcorrenciaEnum,
  })
  condicao: CondicaoVitimaOcorrenciaEnum;
}
