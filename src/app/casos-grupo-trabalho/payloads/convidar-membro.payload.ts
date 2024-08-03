import { ApiProperty } from '@nestjs/swagger';

export class DadosConvidadoPayload {
  @ApiProperty({ description: 'Nome do convidado' })
  nome: string;

  @ApiProperty({ description: 'E-mail para acesso do convidado' })
  email: string;
}

export class ConvidarMembroGrupoTrabalhoRequest {
  @ApiProperty({
    description: 'Motivo do convite',
  })
  motivo: string;

  @ApiProperty({ description: 'Dados do convidado' })
  convidado: DadosConvidadoPayload;
}

export class ConvidarMembroGrupoTrabalhoResponse {
  @ApiProperty({ description: 'Token de identificação do convite criado' })
  identificador: string;
}
