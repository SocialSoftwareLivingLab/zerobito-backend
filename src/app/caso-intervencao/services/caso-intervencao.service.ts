import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import CasoEntity from '@/app/casos/entities/caso.entity';
import { StatusCasoEnum } from '@/app/casos/entities/status-caso.enum';
import MembroGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/membro-grupo.entity';
import CasoIntervencaoEntity from '../entities/acoes-intervencao.entity';
import { CreateCasoIntervencaoDto, UpdateIntervencaoDto } from '../dtos/caso-intervencao.dto';
import { AcoesIntervencaoStatusEnum } from '../enum/acao-intervencao-status.enum';

import { ArquivoService, ArquivoVinculoService } from '@/app/arquivos/services/arquivo.service';
import { ArquivoVinculoEntity } from '@/app/arquivos/entities/arquivo.vinculo.entity';
import { InjectRepository as InjectRepoArquivo } from '@nestjs/typeorm';

@Injectable()
export class CasoIntervencaoService {
  constructor(
    @InjectRepository(CasoIntervencaoEntity)
    private readonly intervencaoRepository: Repository<CasoIntervencaoEntity>,

    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,

    @InjectRepository(MembroGrupoTrabalhoEntity)
    private readonly membroRepository: Repository<MembroGrupoTrabalhoEntity>,

    @InjectRepoArquivo(ArquivoVinculoEntity)
    private readonly vinculoRepository: Repository<ArquivoVinculoEntity>,

    private readonly arquivoService: ArquivoService,
    private readonly vinculoService: ArquivoVinculoService,
  ) {}

  /* =====================================================
      MÉTODO INTERNO - VALIDAR INTERVENÇÃO DO CASO
  ===================================================== */

  private async findIntervencaoDoCaso(
    casoId: number,
    intervencaoId: number,
  ) {
    const intervencao = await this.intervencaoRepository.findOne({
      where: {
        id: intervencaoId,
        caso: { id: casoId },
      },
      relations: ['caso', 'autor'],
    });

    if (!intervencao) {
      throw new NotFoundException(
        'Intervenção não encontrada para este caso',
      );
    }

    return intervencao;
  }

  /* =====================================================
      CRIAR INTERVENÇÃO
  ===================================================== */

  async create(dto: CreateCasoIntervencaoDto, casoId: number) {
    const caso = await this.casoRepository.findOne({
      where: { id: casoId },
    });

    if (!caso) {
      throw new NotFoundException('Caso não encontrado');
    }

    const membroGrupo = await this.membroRepository.findOne({
      where: {
        caso: { id: casoId },
        membro: { nome: dto.autorNome },
      },
      relations: ['membro', 'caso'],
    });

    if (!membroGrupo) {
      throw new NotFoundException('Responsável não encontrado');
    }

    const prioridade = dto.prioridade ?? 0.5;

    if (prioridade < 0 || prioridade > 1) {
      throw new BadRequestException(
        'Prioridade deve estar entre 0 e 1',
      );
    }

    const intervencao = this.intervencaoRepository.create({
      name: dto.name,
      recursos: dto.recursos,
      prazo: dto.prazo ?? new Date(),
      prioridade,
      nivel: dto.nivel,
      status: AcoesIntervencaoStatusEnum.SEM_PREVISAO,
      caso,
      autor: membroGrupo,
    });

    return this.intervencaoRepository.save(intervencao);
  }

  /* =====================================================
      EDITAR
  ===================================================== */

  async update(
    intervencaoId: number,
    dto: UpdateIntervencaoDto,
    casoId: number,
  ) {
    const intervencao = await this.findIntervencaoDoCaso(
      casoId,
      intervencaoId,
    );

    if (dto.prioridade !== undefined) {
      if (dto.prioridade < 0 || dto.prioridade > 1) {
        throw new BadRequestException(
          'Prioridade deve estar entre 0 e 1',
        );
      }
    }

    Object.assign(intervencao, dto);

    return this.intervencaoRepository.save(intervencao);
  }

  /* =====================================================
      LISTAR POR CASO
  ===================================================== */

  async findAllByCaso(casoId: number) {
    return this.intervencaoRepository.find({
      where: { caso: { id: casoId } },
      relations: ['autor', 'autor.membro'],
      order: { prazo: 'ASC' },
    });
  }

  /* =====================================================
      AGRUPAR POR AUTOR
  ===================================================== */

  async listarAgrupadoPorAutor(casoId: number) {
    const intervencoes = await this.findAllByCaso(casoId);

    return intervencoes.reduce((acc, intervencao) => {
      const autorId = intervencao.autor.id;

      if (!acc[autorId]) {
        acc[autorId] = {
          autor: intervencao.autor,
          intervencoes: [],
        };
      }

      acc[autorId].intervencoes.push(intervencao);

      return acc;
    }, {});
  }

  /* =====================================================
      CALENDÁRIO
  ===================================================== */

  async listarParaCalendario(casoId: number) {
    return this.intervencaoRepository.find({
      where: { caso: { id: casoId } },
      select: ['id', 'name', 'prazo', 'status'],
      order: { prazo: 'ASC' },
    });
  }

  /* =====================================================
      PODE FINALIZAR
  ===================================================== */

  async podeFinalizarIntervencao(
    casoId: number,
  ): Promise<{ podeFinalizar: boolean; mensagem?: string }> {
    const total = await this.intervencaoRepository.count({
      where: { caso: { id: casoId } },
    });

    if (total === 0) {
      return {
        podeFinalizar: false,
        mensagem: 'Para finalizar é necessário ter ao menos uma intervenção registrada.',
      };
    }

    const naoConcluidas = await this.intervencaoRepository.count({
      where: {
        caso: { id: casoId },
        status: Not(AcoesIntervencaoStatusEnum.EXITO),
      },
    });

    if (naoConcluidas > 0) {
      return {
        podeFinalizar: false,
        mensagem: 'Para finalizar todas as intervenções devem estar com status de êxito.',
      };
    }

    return { podeFinalizar: true };
  }

  /* =====================================================
      ANEXAR ARQUIVO
  ===================================================== */

  async anexarArquivo(
    casoId: number,
    intervencaoId: number,
    file: Express.Multer.File,
  ) {
    const intervencao = await this.findIntervencaoDoCaso(
      casoId,
      intervencaoId,
    );

    const arquivo = await this.arquivoService.upload(
      file,
      'casos',
    );

    await this.vinculoService.vincular(
      arquivo.id,
      'CasoIntervencao',
      intervencao.id.toString(),
    );

    return arquivo;
  }

  /* =====================================================
      LISTAR ANEXOS
  ===================================================== */

  async listarArquivosDaIntervencao(
    casoId: number,
    intervencaoId: number,
  ) {
    await this.findIntervencaoDoCaso(casoId, intervencaoId);

    const vinculos = await this.vinculoRepository.find({
      where: {
        entityType: 'CasoIntervencao',
        entityId: intervencaoId.toString(),
      },
      relations: ['arquivo'],
    });

    return vinculos.map(v => v.arquivo);
  }

  /* =====================================================
      DOWNLOAD ANEXO
  ===================================================== */

  async downloadAnexo(
    casoId: number,
    intervencaoId: number,
    arquivoId: string,
  ) {
    await this.findIntervencaoDoCaso(casoId, intervencaoId);

    const vinculo = await this.vinculoRepository.findOne({
      where: {
        entityType: 'CasoIntervencao',
        entityId: intervencaoId.toString(),
        arquivo: { id: arquivoId },
      },
    });

    if (!vinculo) {
      throw new NotFoundException(
        'Arquivo não pertence a esta intervenção',
      );
    }

    return this.arquivoService.download(arquivoId);
  }

  /* =====================================================
      INICIAR INTERVENÇÃO
  ===================================================== */

  async iniciarIntervencao(casoId: number) {
    const caso = await this.casoRepository.findOne({ where: { id: casoId } });
    if (!caso) throw new NotFoundException('Caso não encontrado');

    if (caso.status !== StatusCasoEnum.EM_INVESTIGACAO) {
      throw new BadRequestException(
        'O caso deve estar em investigação para iniciar a intervenção.',
      );
    }

    caso.status = StatusCasoEnum.EM_INTERVENCAO;
    await this.casoRepository.save(caso);

    return { message: 'Intervenção iniciada com sucesso' };
  }

  /* =====================================================
      FINALIZAR INTERVENÇÃO
  ===================================================== */

  async finalizarIntervencao(casoId: number) {
    const { podeFinalizar, mensagem } =
      await this.podeFinalizarIntervencao(casoId);

    if (!podeFinalizar) {
      throw new BadRequestException(mensagem);
    }

    const caso = await this.casoRepository.findOne({
      where: { id: casoId },
    });

    if (!caso) throw new NotFoundException('Caso não encontrado');

    caso.status = StatusCasoEnum.EM_FINALIZACAO;
    await this.casoRepository.save(caso);

    return { message: 'Intervenção finalizada com sucesso' };
  }

  /* =====================================================
      REMOVER ANEXO
  ===================================================== */

  async removerAnexo(
    casoId: number,
    intervencaoId: number,
    arquivoId: string,
  ) {
    await this.findIntervencaoDoCaso(casoId, intervencaoId);

    await this.vinculoService.desvincular(
      arquivoId,
      'CasoIntervencao',
      intervencaoId.toString(),
    );

    const aindaVinculado =
      await this.vinculoRepository.count({
        where: { arquivo: { id: arquivoId } },
      });

    if (aindaVinculado === 0) {
      await this.arquivoService.delete(arquivoId);
    }

    return { message: 'Anexo removido com sucesso' };
  }
}