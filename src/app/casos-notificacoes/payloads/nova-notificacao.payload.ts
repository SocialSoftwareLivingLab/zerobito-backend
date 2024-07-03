import { ApiProperty } from '@nestjs/swagger';

export class CriarNotificacaoRequest {
  @ApiProperty({
    example: '123456',
    description: 'Número de identificação da notificação',
  })
  identificador: string;

  @ApiProperty({
    example: true,
    description: 'Indica se a notificação foi emitida',
  })
  isEmitida: boolean;

  @ApiProperty({
    example: 'Aguardando',
    description: 'Indica status da Emissão'
  })
  statusNotificacao: string;

  @ApiProperty({
    example: 'CAT*',
    description: 'Tipo de documento da notificação',
  })
  tipo: string;

  @ApiProperty({
    example: '2021-05-10',
    description: 'Data de emissão da notificação',
    nullable: true
  })
  dataEmissao: Date;

  @ApiProperty({
    example: 'Observação da notificação',
    description: 'Texto de observação para a notificação',
  })
  observacao: string;
}

export class CriarNotificacaoResponse {
  @ApiProperty({
    example: 1,
    description: 'ID da notificação criada',
  })
  id: number;

  @ApiProperty({
    example: '123456',
    description: 'Número de identificação da notificação',
  })
  identificacao: string;

  @ApiProperty({
    example: true,
    description: 'Indica se a notificação foi emitida',
  })
  isEmitida: boolean;

  @ApiProperty({
    example: 'Aguardando',
    description: 'Indica status da Emissão'
  })
  statusNotificacao: string;


  @ApiProperty({
    example: 'CAT*',
    description: 'Tipo de documento da notificação',
  })
  tipo: string;

  @ApiProperty({
    example: '2021-05-10',
    description: 'Data de emissão da notificação',
  })
  dataEmissao: Date;

  @ApiProperty({
    example: 'Observação da notificação',
    description: 'Texto de observação para a notificação',
  })
  observacao: string;

  @ApiProperty({
    example: '2021-05-10T15:00:00Z',
    description: 'Data de criação da notificação',
  })
  dataCriacao: Date;
}
