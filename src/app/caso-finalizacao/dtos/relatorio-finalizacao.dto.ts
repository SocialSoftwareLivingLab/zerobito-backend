import { IsString } from 'class-validator';

export class AtualizarAtorRelatorioDto {
  @IsString()
  descricao: string;
}

export class SalvarComentarioAtorDto {
  @IsString()
  texto: string;
}
