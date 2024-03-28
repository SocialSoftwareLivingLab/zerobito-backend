import { MensagensHelper } from '@/helpers/mensagens.helper';
import { RegexHelper } from '@/helpers/regex.helper';
import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class EmpresaDto {
  @ApiProperty({ description: 'Nome da empresa', example: 'Empresa X' })
  nome: string;

  @ApiProperty({
    description: 'CNPJ da empresa (sem máscaras)',
    example: '00000000000100',
  })
  @Matches(RegexHelper.CNPJ, {
    message: MensagensHelper.Documentos.CNPJ_INVALIDO,
  })
  cnpj: string;
}
