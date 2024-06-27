import { ApiProperty } from '@nestjs/swagger';

export class EditarLocalizacaoRequest {
  @ApiProperty({
    description: 'Cidade do caso',
    example: 'Lavras',
  })
  cidade: string;

  @ApiProperty({
    description: 'Estado do caso',
    example: 'Minas Gerais',
  })
  estado: string;

  @ApiProperty({
    description: 'Logradouro do caso',
    example: 'Trevo Rotatório Professor Edmir Sá Santos',
  })
  logradouro: string;

  @ApiProperty({
    description: 'Coordenada de latitude',
    example: -44.99465105397511,
  })
  latitude: number;

  @ApiProperty({
    description: 'Coordenada de longitude',
    example: -21.2308171408828,
  })
  longitude: number;
}
