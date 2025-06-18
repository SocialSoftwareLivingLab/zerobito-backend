import { UsuarioEntity } from "@/app/usuarios/usuarios.entity";
import CasoEntity from "../entities/caso.entity";
import { UsuarioAutenticadoDto } from "@/auth/dtos/usuario-autenticado.dto";

export const CasoCriadoEventKey = 'caso.criado';

export interface CasoCriadoEvent {
  id: number;
  entity: CasoEntity;
  criador: UsuarioAutenticadoDto;
  dataCriacao: Date;
  instituicao: string;
}