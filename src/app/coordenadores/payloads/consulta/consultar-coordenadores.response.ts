import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import { ApiProperty } from '@nestjs/swagger';

export default class ConsultarCoordenadoresResponseDto {
  @ApiProperty({ description: 'ID do coordenador' })
  id: number;

  @ApiProperty({ description: 'Nome do coordenador' })
  nome: string;

  @ApiProperty({ description: 'Email do coordenador' })
  email: string;

  @ApiProperty({ description: 'Data de criação do coordenador' })
  dataCriacao: Date;

  static fromEntity(entity: UsuarioEntity): ConsultarCoordenadoresResponseDto {
    const dto = new ConsultarCoordenadoresResponseDto();
    dto.id = entity.id;
    dto.nome = entity.nome;
    dto.email = entity.email;
    dto.dataCriacao = entity.dataCriacao;
    return dto;
  }
}
