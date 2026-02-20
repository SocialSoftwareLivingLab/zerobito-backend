import { ApiProperty } from '@nestjs/swagger';

export class ResponsavelAcaoDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nome: string;
}

export class StatusAcaoDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    codigo: string;

    @ApiProperty()
    nome: string;
}

export class TipoAcaoDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    codigo: string;

    @ApiProperty()
    nome: string;
}

export class AcaoIntervencaoResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nome: string;

    @ApiProperty()
    descricao: string;

    @ApiProperty({ type: ResponsavelAcaoDto })
    responsavel: ResponsavelAcaoDto;

    @ApiProperty({ type: StatusAcaoDto })
    status: StatusAcaoDto;

    @ApiProperty({ type: StatusAcaoDto, required: false })
    statusConclusao?: StatusAcaoDto;

    @ApiProperty({ type: TipoAcaoDto })
    tipoAcao: TipoAcaoDto;

    @ApiProperty()
    prazo: Date;

    @ApiProperty({ required: false })
    dataConclusao?: Date;

    @ApiProperty({ required: false })
    comentario?: string;

    @ApiProperty()
    dataCriacao: Date;
}
