import MembroGrupoTrabalhoEntity from "@/app/casos-grupo-trabalho/entities/membro-grupo.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import StatusTarefaEntity from "./status-tarefa.entity";

@Entity({ name: 'caso_tarefas'})
export default class TarefaEntity {
    @PrimaryGeneratedColumn('increment', {type: 'bigint' })
    id: number;

    @Column({ name: 'identificador', type: 'uuid' })
    identificador: string;

    @Column({ name: 'nome', type: 'string' })
    nome: string;

    @ManyToOne(() => MembroGrupoTrabalhoEntity)
    membroGrupoTrabalho: MembroGrupoTrabalhoEntity;

    @ManyToOne(() => StatusTarefaEntity)
    status: StatusTarefaEntity;

    @CreateDateColumn({ name: 'data_criacao' })
    dataVinculo: Date;

    @DeleteDateColumn({ name: 'data_remocao' })
    dataRemocao?: Date;

    @Column({ name: 'prazo_de_conclusao', type: 'date'})
    prazo: Date;

    @Column({ name: 'comentario', type: 'string'})
    comentario: string;
}