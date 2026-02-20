import CasoEntity from "@/app/casos/entities/caso.entity";
import { UsuarioEntity } from "@/app/usuarios/usuarios.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "caso_intervencao_agendamento_reuniao" })
export default class AgendamentoReuniaoIntervencaoEntity {

    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id: number;

    @ManyToOne(() => CasoEntity, { nullable: false })
    caso: CasoEntity;

    @Column({ name: 'data_reuniao', type: 'timestamp with time zone' })
    data: Date;

    @ManyToOne(() => UsuarioEntity)
    @JoinColumn({ name: 'id_usuario_solicitante' })
    solicitante: UsuarioEntity;

    @CreateDateColumn()
    dataCriacao: Date;

}