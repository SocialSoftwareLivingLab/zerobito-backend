export class MembroGrupoTrabalhoResponse {
  id: number;
  identificador: string;
  nome: string;
  email: string;
  instituicao: string;
  status: {
    codigo: string;
    nome: string;
  };
}
