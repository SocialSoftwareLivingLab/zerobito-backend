import { ApiProperty } from "@nestjs/swagger";

export class RegistarAtaRequest {
  @ApiProperty({
    description: 'Conteudo da ata',
  })
  conteudo: string;

}