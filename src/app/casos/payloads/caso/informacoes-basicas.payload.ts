import { ApiProperty } from '@nestjs/swagger';

export class EditarInformacoesBasicasRequest {
  @ApiProperty({
    description: 'Causa Primária',
    example: 'INDEFINIDO',
  })
  causaPrimaria: string;

  @ApiProperty({
    description: 'Causa Secundária',
    example: 'INDEFINIDO',
  })
  causaSecundaria: string;

  @ApiProperty({
    description: 'Diagnóstico do caso',
    example: 'INDEFINIDO',
  })
  diagnostico: string;

  @ApiProperty({
    description: 'Comentário do caso',
  })
  comentarios: string;
}
