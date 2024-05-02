import { ApiProperty } from '@nestjs/swagger';
import { TipoFonte } from '../../entities/info-fonte.entity';

export class FonteOcorrenciaDto {
  @ApiProperty({
    description: 'Tipo da fonte',
    example: 'VITIMA',
    enum: TipoFonte,
  })
  tipo: TipoFonte;

  @ApiProperty({
    description: 'Outro tipo da fonte',
    example: 'VIZINHO',
  })
  outroTipo: string;

  @ApiProperty({
    description: 'Detalhes adicionais sobre a fonte da denúncia',
  })
  detalhe: string;
}
