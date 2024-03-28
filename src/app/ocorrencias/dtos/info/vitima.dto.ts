import { ApiProperty } from '@nestjs/swagger';
import {
  CondicaoVitimaEnum,
  GravidadeCondicaoEnum,
} from '../../entities/info-vitima.entity';

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
    enum: CondicaoVitimaEnum,
  })
  condicao: CondicaoVitimaEnum;

  @ApiProperty({
    description: 'Gravidade da condição da vítima',
    example: 'EMERGENCIAL',
    enum: GravidadeCondicaoEnum,
  })
  gravidade: GravidadeCondicaoEnum;
}
