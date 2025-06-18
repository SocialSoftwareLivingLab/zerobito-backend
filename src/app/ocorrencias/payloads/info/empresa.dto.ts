import { MensagensHelper } from '@/helpers/mensagens.helper';
import { RegexHelper } from '@/helpers/regex.helper';
import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { TomadoraServicoDto } from './tomadora-servico.dto';

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

  @ApiProperty({
    description: 'CNAE da empresa (sem máscaras)',
    example: '0000100',
  })
  cnae: string;

  @ApiProperty({
    description: 'Informações da empresa tomadora de serviço',
    type: () => TomadoraServicoDto,
  })
  tomadoraServico: TomadoraServicoDto;
}
