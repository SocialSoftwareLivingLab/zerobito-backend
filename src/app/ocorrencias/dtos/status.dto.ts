import { ApiProperty } from '@nestjs/swagger';
import { StatusOcorrenciaEnum } from '../enums/status-ocorrencia.enum';

export default class StatusOcorrencia {
  @ApiProperty({
    description: 'Sigla do status da ocorrência',
    example: 'AGUARDANDO_ANALISE',
    enum: StatusOcorrenciaEnum,
  })
  sigla: StatusOcorrenciaEnum;

  @ApiProperty({ description: 'Descrição do status da ocorrência' })
  descricao: string;
}
