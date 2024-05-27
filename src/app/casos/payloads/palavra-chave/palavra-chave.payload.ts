import { ApiProperty } from '@nestjs/swagger';

export class PalavraChaveResponse {
  @ApiProperty({ example: 1, description: 'ID da palavra-chave criada' })
  id: number;

  @ApiProperty({
    example: 'Palavra chave',
    description: 'Valor da palavra-chave',
  })
  valor: string;
}
