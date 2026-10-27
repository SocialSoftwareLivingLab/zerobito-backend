import {
  BadRequestException,
  ForbiddenException,
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
import ComentarioAtorRelatorioEntity from '../entities/comentario-ator-relatorio.entity';
import { UsuarioPerfilService } from '@/app/usuario-perfil/entities/usuario-perfil.service';
import { PermissaoEnum } from '@/app/usuarios/enums/permissoes.enum';
import {
  AtualizarAtorRelatorioDto,
  SalvarComentarioAtorDto,
} from '../dtos/relatorio-finalizacao.dto';

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

    @InjectRepository(ComentarioAtorRelatorioEntity)
    private readonly comentarioRepository: Repository<ComentarioAtorRelatorioEntity>,

    private readonly usuarioPerfilService: UsuarioPerfilService,
  ) {}

  /* =====================================================
      MÉTODO INTERNO - QUEM NÃO EDITA SÓ VÊ APÓS A SUBMISSÃO AO GT
  ===================================================== */

  /**
   * O acesso às rotas é controlado por @PermissaoCaso. Aqui fica só a regra que
   * depende do estado do relatório: quem não pode editá-lo (ex.: membros do GT)
   * só o enxerga depois que ele sai do rascunho.
   */
  private async validarVisibilidade(
    casoId: number,
    usuarioId: number,
    relatorio: RelatorioFinalizacaoEntity | null,
  ) {
    const permissoes =
      await this.usuarioPerfilService.obterPermissoesUsuarioNoCaso(
        usuarioId,
        casoId,
      );
    const podeEditar = permissoes.includes(
      PermissaoEnum.CASOS_EDITAR_RELATORIO_FINALIZACAO,
    );

    if (
      !podeEditar &&
      (!relatorio || relatorio.status === StatusRelatorioFinalizacaoEnum.RASCUNHO)
    ) {
      throw new ForbiddenException(
        'O relatório de finalização ainda não foi submetido ao grupo de trabalho.',
      );
    }
  }

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

  async buscarOuCriarRelatorio(casoId: number, usuarioId: number) {
    const existente = await this.relatorioRepository.findOne({
      where: { caso: { id: casoId } },
      relations: ['atores'],
    });

    await this.validarVisibilidade(casoId, usuarioId, existente);

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

  /* =====================================================
      MÉTODO INTERNO - FORMATAR COMENTÁRIO (SEM DADOS SENSÍVEIS DO AUTOR)
  ===================================================== */

  private formatarComentario(comentario: ComentarioAtorRelatorioEntity) {
    return {
      id: comentario.id,
      atorId: comentario.ator.id,
      texto: comentario.texto,
      autor: { id: comentario.autor.id, nome: comentario.autor.nome },
      dataAtualizacao: comentario.dataAtualizacao,
    };
  }

  /* =====================================================
      LISTAR COMENTÁRIOS DO RELATÓRIO (TODOS OS AUTORES)
  ===================================================== */

  async listarComentarios(casoId: number, usuarioId: number) {
    const relatorio = await this.relatorioRepository.findOne({
      where: { caso: { id: casoId } },
    });
    await this.validarVisibilidade(casoId, usuarioId, relatorio);

    const comentarios = await this.comentarioRepository.find({
      where: { ator: { relatorio: { caso: { id: casoId } } } },
      relations: ['ator', 'autor'],
      order: { dataCriacao: 'ASC' },
    });

    return comentarios.map((comentario) => this.formatarComentario(comentario));
  }

  /* =====================================================
      SALVAR MEU COMENTÁRIO EM UM ATOR
  ===================================================== */

  async salvarComentario(
    casoId: number,
    atorId: number,
    usuarioId: number,
    dto: SalvarComentarioAtorDto,
  ) {
    const ator = await this.atorRepository.findOne({
      where: { id: atorId, relatorio: { caso: { id: casoId } } },
      relations: ['relatorio'],
    });

    if (!ator) {
      throw new NotFoundException('Ator não encontrado para este caso');
    }

    if (ator.relatorio.status !== StatusRelatorioFinalizacaoEnum.REVISAO) {
      throw new BadRequestException(
        'Só é possível comentar quando o relatório estiver em revisão.',
      );
    }

    const existente = await this.comentarioRepository.findOne({
      where: { ator: { id: atorId }, autor: { id: usuarioId } },
    });

    if (!dto.texto.trim()) {
      if (existente) await this.comentarioRepository.remove(existente);
      return null;
    }

    const comentario =
      existente ??
      this.comentarioRepository.create({
        ator: { id: atorId },
        autor: { id: usuarioId },
      });
    comentario.texto = dto.texto;

    const salvo = await this.comentarioRepository.save(comentario);

    const completo = await this.comentarioRepository.findOne({
      where: { id: salvo.id },
      relations: ['ator', 'autor'],
    });

    return this.formatarComentario(completo);
  }
}
