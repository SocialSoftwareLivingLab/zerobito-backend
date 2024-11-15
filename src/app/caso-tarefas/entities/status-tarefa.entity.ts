import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tarefa_status'})
export default class StatusTarefaEntity {
    @PrimaryGeneratedColumn('identity', {type: 'bigint' })
    id: number;

    @Column()
    codigo: string;
    
    @Column()
    nome: string;

    @Column()
    descricao: string;
}