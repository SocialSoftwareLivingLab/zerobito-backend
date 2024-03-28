import { Column } from 'typeorm';

export class LocalOcorrencia {
  @Column({ name: 'local_latitude', nullable: true })
  latitude: number;

  @Column({ name: 'local_longitude', nullable: true })
  longitude: number;

  @Column({ name: 'local_cidade' })
  cidade: string;

  @Column({ name: 'local_estado' })
  estado: string;

  @Column({ name: 'local_logradouro' })
  logradouro: string;
}
