import { IsNotEmpty } from 'class-validator';

export class VincularOcorrenciaRequest {
  @IsNotEmpty()
  ocorrencia: number;
}
