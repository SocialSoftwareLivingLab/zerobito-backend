import { IsString } from 'class-validator';

export class AtualizarAtorRelatorioDto {
  @IsString()
  descricao: string;
}
