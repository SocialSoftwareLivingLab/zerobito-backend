import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tarefa_conclusao_status'})
export default class StatusConclusaoTarefaEntity {
    @PrimaryGeneratedColumn('identity', {type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    codigo: string;
    
    @Column({ type: 'varchar', length: 255 })
    nome: string;

    @Column({ type: 'varchar', length: 255 })
    descricao: string;
}