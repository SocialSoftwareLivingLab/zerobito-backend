import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'intervencao_acao_tipo' })
export default class TipoAcaoIntervencaoEntity {
    @PrimaryGeneratedColumn('identity', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    codigo: string;

    @Column({ type: 'varchar', length: 255 })
    nome: string;

    @Column({ type: 'varchar', length: 255 })
    descricao: string;
}
