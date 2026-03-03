import { IsDateString, IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';
import { AcoesIntervencaoStatusEnum } from '../enum/acao-intervencao-status.enum';

export class CreateCasoIntervencaoDto {
  @IsString()
  name: string;

  @IsString()
  recursos: string;

  @IsDateString()
  prazo: Date;

  @IsNumber()
  @Min(0)
  @Max(1)
  prioridade: number;

  @IsEnum(AcoesIntervencaoStatusEnum)
  status: AcoesIntervencaoStatusEnum;

  casoId: number;
  autorId: number;
}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateIntervencaoDto extends PartialType(CreateCasoIntervencaoDto) {}