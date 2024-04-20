export interface BuscarCoordenadorInput {
  nome: string;
}

export interface BuscarCoordenadorOutput {
  id: number;
  nome: string;
  email: string;
  dataCriacao: Date;
}
