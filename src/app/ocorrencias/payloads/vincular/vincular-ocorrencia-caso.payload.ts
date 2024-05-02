import { ApiProperty } from '@nestjs/swagger';

export class VincularOcorrenciaCasoPayload {
  @ApiProperty({
    description: 'ID do caso',
    example: 1,
  })
  idCaso: number;
}
