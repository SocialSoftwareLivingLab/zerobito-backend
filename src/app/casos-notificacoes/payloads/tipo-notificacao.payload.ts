import { ApiProperty } from '@nestjs/swagger';

export class TipoNotificacaoResponse {
  @ApiProperty({ example: 1, description: 'ID do tipo de notificação' })
  id: number;

  @ApiProperty({
    example: 'CAT*',
    description: 'Sigla do tipo de notificação',
  })
  nome: string;

  @ApiProperty({
    example: 'CAT*',
    description: 'Descrição do tipo de notificação',
  })
  descricao: string;
}
