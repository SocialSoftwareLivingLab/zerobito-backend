import { Injectable } from '@nestjs/common';

@Injectable()
export class CasosGrupoTrabalhoService { }

/**
 * 
POST /casos/{id}/grupo-trabalho/membros
GET /casos/{id}/grupo-trabalho/membros
POST /casos/{id}/grupo-trabalho/membros/{idMembro}/reenviar-convite
DELETE /casos/{id}/grupo-trabalho/membros/{idMembro}
 */
