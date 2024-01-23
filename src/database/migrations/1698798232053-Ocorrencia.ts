import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Ocorrencia1698798232053 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verifica se a tabela "ocorrencias" já existe
        const tableExists = await queryRunner.hasTable("ocorrencias");
        if (!tableExists) {
            await queryRunner.createTable(
                new Table({
                    name: "ocorrencias",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true,
                        },
                        {
                            name: "denuncia",
                            type: "varchar",
                        },
                        {
                            name: "local",
                            type: "varchar",
                        },
                        {
                            name: "data",
                            type: "timestamp",
                        },
                        {
                            name: "nomeVitima",
                            type: "varchar",
                        },
                        {
                            name: "condicaoAcidentado",
                            type: "varchar",
                        },
                        {
                            name: "nomeEmpresaEmpregadora",
                            type: "varchar",
                        },
                        {
                            name: "gravidade",
                            type: "varchar",
                        },
                        {
                            name: "status",
                            type: "varchar",
                        },
                        {
                            name: "tipoOcorrencia",
                            type: "varchar",
                        },{
                            name: "nomeContato",
                            type: "varchar",
                        },{
                            name: "emailContato",
                            type: "varchar",
                        },{
                            name: "telefoneContato",
                            type: "varchar",
                        }
                    ],
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Verifica se a tabela "ocorrencias" existe antes de tentar removê-la
        const tableExists = await queryRunner.hasTable("ocorrencias");
        if (tableExists) {
            await queryRunner.dropTable("ocorrencias");
        }
    }
}
