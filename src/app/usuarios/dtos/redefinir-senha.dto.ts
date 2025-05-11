// src/app/usuarios/dtos/redefinir-senha.dto.ts
import { IsNotEmpty } from 'class-validator';

export class RedefinirSenhaDto {
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  senha: string;
}