import LocalizacaoCaso from '@/app/casos/entities/localizacao/localizacao.entity';
import { LocalOcorrencia } from '@/app/ocorrencias/entities/local.entity';
import { OcorrenciaEntity } from '@/app/ocorrencias/entities/ocorrencias.entity';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';

export class RegistrarCasoRequest {
  nome: string;
  coordenador: number;
  criador: UsuarioAutenticadoDto;
  local: LocalOcorrencia;
  ocorrencias: OcorrenciaEntity[];
}

export class RegistrarCasoResponse {
  id: number;
  nome: string;
  coordenador: number;
  dataCriacao: Date;
  localizacao: LocalizacaoCaso;
}
