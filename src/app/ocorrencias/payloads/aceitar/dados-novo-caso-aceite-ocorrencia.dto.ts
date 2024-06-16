import { ApiProperty } from '@nestjs/swagger';
import { LocalOcorrencia } from '../../entities/local.entity';

export class DadosNovoCasoAceiteOcorrencia {
  @ApiProperty({
    description: 'Nome do novo caso que será criado ao aceitar a ocorrência',
    example: 'Acidente de Trabalho na UNICAMP',
  })
  nome: string;

  @ApiProperty({
    description: 'ID do usuário que será coordenador do caso aceito',
    example: '1',
  })
  coordenador: number;

  @ApiProperty({
    description: 'local da ocorrencia',
  })
  local: LocalOcorrencia;
}
