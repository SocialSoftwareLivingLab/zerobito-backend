import MembroGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/membro-grupo.entity';
import CasoEntity from '@/app/casos/entities/caso.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import StatusAcaoIntervencaoEntity from './status-acao-intervencao.entity';
import StatusConclusaoAcaoIntervencaoEntity from './status-conclusao-acao-intervencao.entity';
import TipoAcaoIntervencaoEntity from './tipo-acao-intervencao.entity';

@Entity({ name: 'caso_intervencao_acoes' })
export default class AcaoIntervencaoEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ name: 'nome', type: 'varchar', length: 255 })
    nome: string;

    @Column({ name: 'descricao', type: 'text', nullable: true })
    descricao: string;

    @ManyToOne(() => CasoEntity)
    @JoinColumn({ name: 'caso_id' })
    caso: CasoEntity;

    @ManyToOne(() => MembroGrupoTrabalhoEntity)
    @JoinColumn({ name: 'membro_grupo_trabalho_id' })
    responsavel: MembroGrupoTrabalhoEntity;

    @ManyToOne(() => StatusAcaoIntervencaoEntity)
    @JoinColumn({ name: 'status_id' })
    status: StatusAcaoIntervencaoEntity;

    @ManyToOne(() => StatusConclusaoAcaoIntervencaoEntity, { nullable: true })
    @JoinColumn({ name: 'status_conclusao_id' })
    statusConclusao: StatusConclusaoAcaoIntervencaoEntity;

    @ManyToOne(() => TipoAcaoIntervencaoEntity)
    @JoinColumn({ name: 'tipo_acao_id' })
    tipoAcao: TipoAcaoIntervencaoEntity;

    @Column({ name: 'prazo_conclusao', type: 'date' })
    prazo: Date;

    @Column({ name: 'data_conclusao', type: 'timestamp', nullable: true })
    dataConclusao: Date;

    @Column({ name: 'comentario', type: 'varchar', length: 500, nullable: true })
    comentario: string;

    @CreateDateColumn({ name: 'data_criacao' })
    dataCriacao: Date;

    @UpdateDateColumn({ name: 'data_atualizacao' })
    dataAtualizacao: Date;

    @DeleteDateColumn({ name: 'data_remocao' })
    dataRemocao: Date;
}
