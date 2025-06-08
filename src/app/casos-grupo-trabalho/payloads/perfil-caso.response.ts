import { ApiProperty } from '@nestjs/swagger';

export class PerfilCasoResponse {
  @ApiProperty({
    description: 'ID do perfil',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Código único do perfil',
    example: 'ANALISTA_CASO',
  })
  codigo: string;

  @ApiProperty({
    description: 'Nome do perfil',
    example: 'Analista de Caso',
  })
  nome: string;

  @ApiProperty({
    description: 'Descrição do perfil',
    example: 'Perfil para análise de casos específicos',
    required: false,
  })
  descricao?: string;

  @ApiProperty({
    description: 'Lista de permissões do perfil',
    example: ['casos:definir-comentarios', 'casos:definir-localizacao'],
    type: [String],
  })
  permissoes: string[];
}
