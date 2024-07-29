

export class MembroGrupoTrabalhoResponse {
  id: number;
  identificador: string;
  nome: string;
  email: string;
  status: {
    codigo: string;
    nome: string;
    descricao: string;
  };
}