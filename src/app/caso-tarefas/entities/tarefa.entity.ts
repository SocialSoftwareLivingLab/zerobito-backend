import MembroGrupoTrabalhoEntity from "@/app/casos-grupo-trabalho/entities/membro-grupo.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import StatusTarefaEntity from "./status-tarefa.entity";
import StatusConclusaoTarefaEntity from "./status-conclusao-tarefa.entity";

@Entity({ name: 'caso_tarefas'})
export default class TarefaEntity {
    @PrimaryGeneratedColumn('increment', {type: 'bigint' })
    id: number;

    @Column({ name: 'nome', type: 'varchar', length: 255})
    nome: string;

    @ManyToOne(() => MembroGrupoTrabalhoEntity)
    membroGrupoTrabalho: MembroGrupoTrabalhoEntity;


    @ManyToOne(() => StatusTarefaEntity)
    status: StatusTarefaEntity;

    @ManyToOne(() => StatusConclusaoTarefaEntity)
    status_conclusao: StatusConclusaoTarefaEntity;

    @CreateDateColumn({ name: 'data_criacao' })
    dataVinculo: Date;

    @DeleteDateColumn({ name: 'data_remocao' })
    dataRemocao?: Date;

    @Column({ name: 'prazo_de_conclusao', type: 'date'})
    prazo: Date;

    @Column({ name: 'comentario', type: 'varchar', length: 255})
    comentario: string;
}