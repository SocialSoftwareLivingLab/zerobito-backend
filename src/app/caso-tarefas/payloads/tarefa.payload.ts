export class TarefaResponse {
    identificador: string;
    nome: string;
    status: {
        codigo: string;
        nome: string;
    };
    prazo: Date;
    comentario: string;   
}

export class RegistrarTarefaRequest {
    nomeMembro: string;
    comentario: string;
    nome: string;
    prazo: Date;
}