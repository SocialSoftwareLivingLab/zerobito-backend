import { ApiProperty } from '@nestjs/swagger';

export class UsuarioCasoResponse {
  @ApiProperty({
    description: 'Identificador do usuário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Usuário 1',
  })
  nome: string;
}

export class InformacoesBasicasResponse {
  @ApiProperty({
    description: 'Comentário do caso',
    example: 'Comentário 1',
  })
  comentario: string;

  @ApiProperty({
    description: 'Sigla da causa primária do caso',
    example: 'CAUSA_EXEMPLO',
  })
  causaPrimaria: string;

  @ApiProperty({
    description: 'Sigla da causa secundária do caso',
    example: 'CAUSA_EXEMPLO',
  })
  causaSecundaria: string;

  @ApiProperty({
    description: 'Sigla do diagnóstico do caso',
    example: 'SIGLA_EXEMPLO',
  })
  diagnostico: string;
}

export class LocalizacaoResponse {
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

  @ApiProperty({
    description: 'Latitude do caso',
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude do caso',
  })
  longitude: number;
}

export class CasoResponse {
  @ApiProperty({
    description: 'Identificador do caso',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do caso',
    example: 'Caso 1',
  })
  nome: string;

  @ApiProperty({
    description: 'Data de criação do caso',
    example: '2021-08-17T00:00:00.000Z',
  })
  dataCriacao: Date;

  @ApiProperty({
    description: 'Criador do caso',
    type: UsuarioCasoResponse,
  })
  criador: UsuarioCasoResponse;

  @ApiProperty({
    description: 'Coordenador do caso',
    type: UsuarioCasoResponse,
  })
  coordenador: UsuarioCasoResponse;

  @ApiProperty({
    description: 'Informações básicas do caso',
    type: InformacoesBasicasResponse,
  })
  informacoesBasicas: InformacoesBasicasResponse;

  @ApiProperty({
    description: 'Localização do caso',
    type: LocalizacaoResponse,
  })
  localizacao: LocalizacaoResponse;
}
