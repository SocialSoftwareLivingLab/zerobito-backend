import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Ocorrencia1698798232053 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name:"ocorrencias",
                columns:[
                    {
                        name:"id",
                        type:"uuid",
                        isPrimary:true,
                    },
                    {
                        name:"denuncia",
                        type:"varchar"
                    },
                    {
                        name:"local",
                        type:"varchar"
                    },
                    {
                        name:"data",
                        type:"timestamp"
                    },
                    {
                        name:"nomeVitima",
                        type:"varchar"
                    },
                    {
                        name:"condicaoAcidentado",
                        type:"varchar"
                    },
                    {
                        name:"nomeEmpresaEmpregadora",
                        type:"varchar"
                    },
                    {
                        name:"gravidade",
                        type:"varchar"
                    },
                    {
                        name:"status",
                        type:"varchar"
                    },
                ]
                })
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
