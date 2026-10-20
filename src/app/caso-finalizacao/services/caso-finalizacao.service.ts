import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import CasoEntity from '@/app/casos/entities/caso.entity';
import { StatusCasoEnum } from '@/app/casos/entities/status-caso.enum';
import RelatorioFinalizacaoEntity from '../entities/relatorio-finalizacao.entity';
import AtorRelatorioFinalizacaoEntity from '../entities/ator-relatorio-finalizacao.entity';
import { AtorFinalizacaoEnum } from '../enum/ator-finalizacao.enum';
import { StatusRelatorioFinalizacaoEnum } from '../enum/status-relatorio-finalizacao.enum';
import { AtualizarAtorRelatorioDto } from '../dtos/relatorio-finalizacao.dto';

const STATUS_EDITAVEIS = [
  StatusRelatorioFinalizacaoEnum.RASCUNHO,
  StatusRelatorioFinalizacaoEnum.REVISAO,
];

@Injectable()
export class CasoFinalizacaoService {
  constructor(
    @InjectRepository(RelatorioFinalizacaoEntity)
    private readonly relatorioRepository: Repository<RelatorioFinalizacaoEntity>,

    @InjectRepository(AtorRelatorioFinalizacaoEntity)
    private readonly atorRepository: Repository<AtorRelatorioFinalizacaoEntity>,

    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
  ) {}

  /* =====================================================
      MÉTODO INTERNO - ORDENAR ATORES CONFORME ENUM
  ===================================================== */

  private ordenarAtores(relatorio: RelatorioFinalizacaoEntity) {
    const ordem = Object.values(AtorFinalizacaoEnum);
    relatorio.atores.sort(
      (a, b) => ordem.indexOf(a.ator) - ordem.indexOf(b.ator),
    );
    return relatorio;
  }

  /* =====================================================
      BUSCAR RELATÓRIO (CRIA EM RASCUNHO SE NÃO EXISTIR)
  ===================================================== */

  async buscarOuCriarRelatorio(casoId: number) {
    const existente = await this.relatorioRepository.findOne({
      where: { caso: { id: casoId } },
      relations: ['atores'],
    });

    if (existente) return this.ordenarAtores(existente);

    const caso = await this.casoRepository.findOne({ where: { id: casoId } });
    if (!caso) throw new NotFoundException('Caso não encontrado');

    if (caso.status !== StatusCasoEnum.EM_FINALIZACAO) {
      throw new BadRequestException(
        'O caso deve estar em finalização para criar o relatório.',
      );
    }

    const relatorio = this.relatorioRepository.create({
      caso,
      status: StatusRelatorioFinalizacaoEnum.RASCUNHO,
      atores: Object.values(AtorFinalizacaoEnum).map((ator) =>
        this.atorRepository.create({ ator, descricao: '' }),
      ),
    });

    const salvo = await this.relatorioRepository.save(relatorio);
    delete salvo.caso;

    return this.ordenarAtores(salvo);
  }

  /* =====================================================
      ATUALIZAR DESCRIÇÃO DE UM ATOR
  ===================================================== */

  async atualizarAtor(
    casoId: number,
    atorId: number,
    dto: AtualizarAtorRelatorioDto,
  ) {
    const ator = await this.atorRepository.findOne({
      where: { id: atorId, relatorio: { caso: { id: casoId } } },
      relations: ['relatorio'],
    });

    if (!ator) {
      throw new NotFoundException('Ator não encontrado para este caso');
    }

    if (!STATUS_EDITAVEIS.includes(ator.relatorio.status)) {
      throw new BadRequestException(
        'O relatório só pode ser editado em rascunho ou revisão.',
      );
    }

    ator.descricao = dto.descricao;
    const salvo = await this.atorRepository.save(ator);
    delete salvo.relatorio;

    return salvo;
  }

  /* =====================================================
      SUBMETER AO GT (RASCUNHO -> REVISÃO)
  ===================================================== */

  async submeterAoGT(casoId: number) {
    const relatorio = await this.relatorioRepository.findOne({
      where: { caso: { id: casoId } },
    });

    if (!relatorio) {
      throw new NotFoundException('Relatório de finalização não encontrado');
    }

    if (relatorio.status !== StatusRelatorioFinalizacaoEnum.RASCUNHO) {
      throw new BadRequestException(
        'Somente relatórios em rascunho podem ser submetidos ao GT.',
      );
    }

    relatorio.status = StatusRelatorioFinalizacaoEnum.REVISAO;
    await this.relatorioRepository.save(relatorio);

    return { message: 'Relatório submetido ao GT com sucesso' };
  }
}
