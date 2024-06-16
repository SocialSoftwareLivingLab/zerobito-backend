import { ApiProperty } from '@nestjs/swagger';

export class EditarLocalizacaoRequest {
  @ApiProperty({
    description: 'Cidade do caso',
    example: 'CIDADE_EXEMPLO',
  })
  cidade: string;

  @ApiProperty({
    description: 'Estado do caso',
    example: 'ESTADO_EXEMPLO',
  })
  estado: string;

  @ApiProperty({
    description: 'Logradouro do caso',
    example: 'LOGRADOURO_EXEMPLO',
  })
  logradouro: string;
}
