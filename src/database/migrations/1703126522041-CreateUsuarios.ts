import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";
import { UserRole } from "../../enums/UserRole"; // Importando o enum UserRole

export class CreateUsuarios1703126522041 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Verifica se a tabela "usuarios" já existe
        const tableExists = await queryRunner.hasTable("usuarios");
        if (!tableExists) {
            await queryRunner.createTable(
                new Table({
                    name: "usuarios",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true,
                            generationStrategy: 'uuid',
                            default: `uuid_generate_v4()`,
                        },
                        {
                            name: "nome",
                            type: "varchar",
                        },
                        {
                            name: "email",
                            type: "varchar",
                            isUnique: true,
                        },
                        {
                            name: "senha",
                            type: "varchar",
                        },
                        {
                            name: "role",
                            type: "enum",
                            enumName: "UserRole",
                            enum: Object.values(UserRole),
                            default: `'${UserRole.USER}'`
                        },
                    ],
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableExists = await queryRunner.hasTable("usuarios");
        if (tableExists) {
            await queryRunner.dropTable("usuarios");
        }
    }
}
