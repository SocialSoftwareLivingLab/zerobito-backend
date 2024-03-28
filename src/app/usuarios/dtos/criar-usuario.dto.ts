import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { RegexHelper } from 'src/helpers/regex.helper';

export class CriarUsuarioRequestDto {
  @ApiProperty({ example: 'Fulano da Silva', description: 'Nome do usuário' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({
    example: 'fulano@email.com',
    description: 'E-mail do usuário',
  })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({
    example: 'Senh@Dificil1*',
    description: 'Senha do usuário',
    minimum: 8,
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @Matches(RegexHelper.password, {
    message:
      'Precisa ter 8 dígitos, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial',
  })
  senha: string;
}

export class CriarUsuarioResponseDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  id: number;

  @ApiProperty({ example: 'Fulano da Silva', description: 'Nome do usuário' })
  nome: string;

  @ApiProperty({
    example: 'fulano@email.com',
    description: 'E-mail do usuário',
  })
  email: string;

  @ApiProperty({
    example: '2021-10-01T00:00:00',
    description: 'Data de criação do usuário',
  })
  dataCriacao: Date;
}
