import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'fulano@email.com',
  })
  email: string;
  @IsEmail({}, { message: 'E-mail inválido' })

  @ApiProperty({ description: 'Senha do usuário', example: 'Senh@Dificil1*' })
  senha: string;
}
