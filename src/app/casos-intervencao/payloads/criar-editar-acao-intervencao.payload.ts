import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CriarAcaoIntervencaoRequest {
    @ApiProperty({ description: 'Nome do membro responsável' })
    @IsNotEmpty()
    @IsString()
    nomeMembro: string;

    @ApiProperty({ description: 'Nome da ação de intervenção' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    nome: string;

    @ApiProperty({ description: 'Prazo de conclusão (YYYY-MM-DD)' })
    @IsNotEmpty()
    @IsString()
    prazo: string;

    @ApiProperty({ description: 'Comentário', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    comentario?: string;
}

export class EditarAcaoIntervencaoRequest {
    @ApiProperty({ description: 'Nome da ação de intervenção', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    nome?: string;

    @ApiProperty({ description: 'Descrição detalhada da ação', required: false })
    @IsOptional()
    @IsString()
    descricao?: string;

    @ApiProperty({ description: 'ID do membro responsável', required: false })
    @IsOptional()
    @IsNumber()
    idResponsavel?: number;

    @ApiProperty({ description: 'ID do status da ação', required: false })
    @IsOptional()
    @IsNumber()
    idStatus?: number;

    @ApiProperty({ description: 'ID do status de conclusão', required: false })
    @IsOptional()
    @IsNumber()
    idStatusConclusao?: number;

    @ApiProperty({ description: 'ID do tipo de ação', required: false })
    @IsOptional()
    @IsNumber()
    idTipoAcao?: number;

    @ApiProperty({ description: 'Prazo de conclusão (YYYY-MM-DD)', required: false })
    @IsOptional()
    @IsString()
    prazo?: string;

    @ApiProperty({ description: 'Data de conclusão (YYYY-MM-DD)', required: false })
    @IsOptional()
    @IsString()
    dataConclusao?: string;

    @ApiProperty({ description: 'Comentário adicional', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    comentario?: string;
}
