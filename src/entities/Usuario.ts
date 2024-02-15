//Classe que ira reverenciar uma table dentro meu banco de dados.
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { UserRole } from '../enums/UserRole'

@Entity('usuarios')
export class Usuario {
    findOne(arg0: { where: { role: UserRole } }) {
        throw new Error('Method not implemented.')
    }

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    nome: string

    @Column({ unique: true })
    email: string

    @Column()
    senha: string

    @Column('enum', {
        enumName: 'UserRole',
        enum: UserRole,
        default: UserRole.USER,
        nullable: true,
    })
    role: UserRole

    constructor() {
        // Evitar que o usuario tenha que passar o id na hora de criar um novo usuario.
        if (!this.id) {
            this.id = uuid()
        }
    }
}
