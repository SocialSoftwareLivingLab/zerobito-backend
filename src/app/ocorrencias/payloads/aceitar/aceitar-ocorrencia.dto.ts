import { ApiProperty } from '@nestjs/swagger';
import { DadosNovoCasoAceiteOcorrencia } from './dados-novo-caso-aceite-ocorrencia.dto';

export class AceitarOcorrenciaRequest {
  @ApiProperty({
    description: 'Dados do novo caso que será criado ao aceitar a ocorrência',
  })
  novoCaso: DadosNovoCasoAceiteOcorrencia;
}
