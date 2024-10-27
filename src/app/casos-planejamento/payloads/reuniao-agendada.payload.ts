import { ApiProperty } from "@nestjs/swagger";


export class ReuniaoAgendadaResponse {
  @ApiProperty({ description: "Identificador do agendamento" })
  id: number;

  @ApiProperty({ description: "Data agendada para a reunião" })
  dataReuniao: Date;

  @ApiProperty({ description: "Data que o agendamento foi realizado" })
  dataCriacao: Date;

  @ApiProperty({ description: "Informações básicas do usuário que realizou o agendamento da reunião" })
  solicitante: {
    nome: string;
    email: string;
  }
}