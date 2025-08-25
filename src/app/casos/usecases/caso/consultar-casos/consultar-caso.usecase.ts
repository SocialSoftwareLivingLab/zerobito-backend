import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import CasoEntity from '../../../entities/caso.entity';
import MembroGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/membro-grupo.entity';
import { PerfisService } from '@/app/usuarios/services/perfis.service';

@Injectable()
export class ConsultarCasoUseCase {
  private readonly logger = new Logger(ConsultarCasoUseCase.name);
  constructor(
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
    @InjectRepository(MembroGrupoTrabalhoEntity)
    private readonly membroRepoistory: Repository<MembroGrupoTrabalhoEntity>,
    private readonly perfisService: PerfisService, // injeta o serviço de perfis
  ) {}

  // TODO: Criar retorno paginado
  public async buscarTodosSumarizado(membroId: number): Promise<CasoEntity[]> {
    // 1. Buscar o membro e pegar o perfilId
    const membro = await this.membroRepoistory.findOne({
      where: { membro: { id: membroId } },
      relations: ['perfil'],
    });

    if (!membro) {
      return [];
    }

    const perfilId = membro.perfil.id;

    // 2. Verificar permissões do perfil
    const permissoes = await this.perfisService.buscarPermissoesDoPerfil(perfilId);
    

    let casos: CasoEntity[];

    const nomesPermissoes = permissoes.map((p) => p.codigo);
    this.logger.debug(`🔑 Permissões do perfil=${perfilId}: ${JSON.stringify(nomesPermissoes)}`);

    if (nomesPermissoes.includes('casos:visualizar-todos')) {
      this.logger.log(`✅ Permissão "casos:visualizar-todos" encontrada → buscando TODOS os casos`);
      // traz todos os casos
      casos = await this.casoRepository.find({
        order: { id: 'asc' },
        relations: [
          'coordenador',
          'criador',
          'informacoesBasicas',
          'informacoesBasicas.causaPrimaria',
          'informacoesBasicas.causaSecundaria',
          'informacoesBasicas.diagnostico',
        ],
        select: {
          id: true,
          nome: true,
          dataCriacao: true,
          dataObito: true,
          dataCaso: true,
          coordenador: {
            id: true,
            nome: true,
          },
          criador: {
            id: true,
            nome: true,
          },
          informacoesBasicas: {
            comentario: true,
            causaPrimaria: { id: true, nome: true },
            causaSecundaria: { id: true, nome: true },
            diagnostico: { id: true, nome: true },
          },
        },
      });
    } else {
      // busca apenas os casos do membro
      const relacoes = await this.membroRepoistory.find({
        where: { membro: { id: membroId } },
        relations: ['caso'],
        select: { caso: { id: true } },
      });

      const casoIds = relacoes.map(r => r.caso.id);

      if (casoIds.length === 0) {
        return [];
      }

      casos = await this.casoRepository.find({
        where: { id: In(casoIds) },
        order: { id: 'asc' },
        relations: [
          'coordenador',
          'criador',
          'informacoesBasicas',
          'informacoesBasicas.causaPrimaria',
          'informacoesBasicas.causaSecundaria',
          'informacoesBasicas.diagnostico',
        ],
        select: {
          id: true,
          nome: true,
          dataCriacao: true,
          dataObito: true,
          dataCaso: true,
          coordenador: {
            id: true,
            nome: true,
          },
          criador: {
            id: true,
            nome: true,
          },
          informacoesBasicas: {
            comentario: true,
            causaPrimaria: { id: true, nome: true },
            causaSecundaria: { id: true, nome: true },
            diagnostico: { id: true, nome: true },
          },
        },
      });
    }

    return casos;
  }
}