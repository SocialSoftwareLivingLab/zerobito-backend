export class RegistrarCasoRequest {
  nome: string;
  coordenador: number;
}

export class RegistrarCasoResponse {
  id: number;
  nome: string;
  coordenador: number;
  dataCriacao: Date;
}
