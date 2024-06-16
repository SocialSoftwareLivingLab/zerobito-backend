import { ApiProperty } from '@nestjs/swagger';
import { TipoNotificacaoResponse } from './tipo-notificacao.payload';

export class CriadorNotificacaoResponse {
  @ApiProperty({ example: 1, description: 'ID do criador da notificação' })
  id: number;

  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome do criador da notificação',
  })
  nome: string;

  @ApiProperty({
    example: 'teste@fulano.com',
    description: 'E-mail do criador da notificação',
  })
  email: string;
}

export class NotificacaoCasoResponse {
  @ApiProperty({ example: 1, description: 'ID da notificação' })
  id: number;

  @ApiProperty({
    example: '123456789',
    description: 'Identificador da notificação',
  })
  identificador: string;

  @ApiProperty({
    example: true,
    description: 'Indica se a notificação foi emitida',
  })
  isEmitida: boolean;

  @ApiProperty({
    example: '2021-08-01',
    description: 'Data de emissão da notificação',
  })
  dataEmissao: Date;

  @ApiProperty({
    example: 'Observação da notificação',
    description: 'Observação da notificação',
  })
  observacao: string;

  @ApiProperty({
    description: 'Tipo da notificação',
  })
  tipo: TipoNotificacaoResponse;

  @ApiProperty({
    example: '2021-08-01T12:00:00Z',
    description: 'Data de criação da notificação',
  })
  dataCriacao: Date;

  @ApiProperty({
    description: 'Criador da notificação',
  })
  criador: CriadorNotificacaoResponse;
}

export class EditarNotificacaoRequest {
  @ApiProperty({
    description: 'estado da emissao do notificacao',
  })
  isEmitida: boolean;
}
