export class TarefaResponse {
    id: number;
    nome: string;
    status: {
        codigo: string;
        nome: string;
    };
    status_conclusao: {
        codigo: string;
        nome: string;
    }
    prazo: Date;
    comentario: string;   
}

export class RegistrarTarefaRequest {
    nomeMembro: string;
    comentario: string;
    nome: string;
    prazo: Date;
}