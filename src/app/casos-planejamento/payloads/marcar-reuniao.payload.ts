import { ApiProperty } from "@nestjs/swagger";

export class MarcarReuniaoPlanejamentoRequest {

  @ApiProperty({
    name: "data",
    description: "Data/hora para a prṕxima reunião que será agendada",
    example: "2024-10-27T16:58:15.094Z"
  })
  data: Date;
}