import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tarefa_status'})
export default class StatusTarefaEntity {
    @PrimaryGeneratedColumn('identity', {type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    codigo: string;
    
    @Column({ type: 'varchar', length: 255 })
    nome: string;

    @Column({ type: 'varchar', length: 255 })
    descricao: string;
}