import { ApiProperty } from '@nestjs/swagger';

export class CriarPalavraChaveApiRequest {
  @ApiProperty({
    example: 'Palavra chave',
    description: 'Valor da palavra-chave',
  })
  valor: string;
}
