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
    membro: {
        id: number;
    }
    comentario: string;
    nome: string;
    prazo: Date;
}