import { MensagensHelper } from '@/helpers/mensagens.helper';
import { RegexHelper } from '@/helpers/regex.helper';
import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class TomadoraServicoDto {
  @ApiProperty({
    description: 'Nome da empresa tomadora de serviço',
    example: 'Empresa Tomadora',
  })
  nome: string;

  @ApiProperty({
    description: 'CNPJ da empresa tomadora de serviço',
    example: '12345678901234',
  })
  @Matches(RegexHelper.CNPJ, {
    message: MensagensHelper.Documentos.CNPJ_INVALIDO,
  })
  cnpj: string;
}
