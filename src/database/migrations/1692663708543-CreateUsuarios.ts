import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUsuarios1692663708543 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:"usuarios",
                columns:[
                    {
                        name:"id",
                        type:"uuid",
                        isPrimary:true,
                    },
                    {
                        name:"nome",
                        type:"varchar"
                    },
                    {
                        name:"email",
                        type:"varchar",
                        isUnique:true
                    },
                    {
                        name:"senha",
                        type:"varchar"
                    },
                ]
                })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
