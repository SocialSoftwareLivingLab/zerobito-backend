import { ApiProperty } from '@nestjs/swagger';
import { TipoFonte } from '../../entities/info-fonte.entity';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { MensagensHelper } from '@/helpers/mensagens.helper';

export class FonteOcorrenciaDto {
  @ApiProperty({ description: 'Nome da fonte', example: 'João da Silva' })
  nome: string;

  @ApiProperty({ description: 'Email da fonte', example: 'joao@email.com' })
  @IsEmail({}, { message: MensagensHelper.Contatos.EMAIL_INVALIDO })
  email: string;

  @ApiProperty({
    description: 'Telefone principal da fonte (sem máscaras)',
    example: '11999999999',
  })
  @IsPhoneNumber('BR', { message: MensagensHelper.Contatos.TELEFONE_INVALIDO })
  telefonePrincipal: string;

  @ApiProperty({
    description: 'Telefone secundário da fonte (sem máscaras)',
    example: '11999999999',
  })
  @IsPhoneNumber('BR', { message: MensagensHelper.Contatos.TELEFONE_INVALIDO })
  telefoneSecundario: string;

  @ApiProperty({
    description: 'Tipo da fonte',
    example: 'VITIMA',
    enum: TipoFonte,
  })
  tipo: TipoFonte;

  @ApiProperty({
    description: 'Outro tipo da fonte',
    example: 'VIZINHO',
  })
  outroTipo: string;
}
