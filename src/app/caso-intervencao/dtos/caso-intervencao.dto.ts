import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { AcoesIntervencaoStatusEnum } from '../enum/acao-intervencao-status.enum';
import { NivelIntervencaoEnum } from '../enum/nivel-intervencao.enum';

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

  @IsOptional()
  @IsEnum(AcoesIntervencaoStatusEnum)
  status?: AcoesIntervencaoStatusEnum;
    
  @IsOptional()
  @IsEnum(NivelIntervencaoEnum)
  nivel?: NivelIntervencaoEnum;

  @IsString()
  autorNome: string;
}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateIntervencaoDto extends PartialType(CreateCasoIntervencaoDto) {}