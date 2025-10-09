import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import CasoEntity from '../../../entities/caso.entity';
import MembroGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/membro-grupo.entity';
import { PerfisService } from '@/app/usuarios/services/perfis.service';
import { UsuarioPerfilService } from '@/app/usuario-perfil/entities/usuario-perfil.service';

@Injectable()
export class ConsultarCasoUseCase {
  private readonly logger = new Logger(ConsultarCasoUseCase.name);
  constructor(
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
    @InjectRepository(MembroGrupoTrabalhoEntity)
    private readonly membroRepoistory: Repository<MembroGrupoTrabalhoEntity>,
    private readonly usuarioPerfilService: UsuarioPerfilService, // substitui perfisService
  ) {}

  public async buscarTodosSumarizado(membroId: number): Promise<CasoEntity[]> {
    this.logger.log("passou por aqui")
    // 1. Buscar o membro
    const membro = await this.membroRepoistory.findOne({
      where: { membro: { id: membroId } },
      relations: ['membro'],
    });

    if (!membro) {
      this.logger.warn(`Membro não encontrado: ${membroId}`);
      return [];
    }

    const userId = membro.membro.id;

    // 2. Obter permissões do usuário para este caso (null se global)
    const casoIdsDoUsuario = await this.membroRepoistory.find({
      where: { membro: { id: userId } },
      relations: ['caso'],
      select: { caso: { id: true } },
    });

    const todosCasos = await this.casoRepository.find({
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
        coordenador: { id: true, nome: true },
        criador: { id: true, nome: true },
        informacoesBasicas: {
          comentario: true,
          causaPrimaria: { id: true, nome: true },
          causaSecundaria: { id: true, nome: true },
          diagnostico: { id: true, nome: true },
        },
      },
    });

    // 3. Filtrar casos baseando-se nas permissões do usuário
    const casosPermitidos: CasoEntity[] = [];

    for (const caso of todosCasos) {
      const permissoes = await this.usuarioPerfilService.obterPermissoesUsuarioNoCaso(
        userId,
        caso.id,
      );

      this.logger.debug(
        `🔑 Permissões do usuário=${userId} no caso=${caso.id}: ${JSON.stringify(permissoes)}`,
      );

      if (permissoes.includes('casos:visualizar-todos') || casoIdsDoUsuario.some((r) => r.caso.id === caso.id)) {
        casosPermitidos.push(caso);
      }
    }

    return casosPermitidos;
  }
}
