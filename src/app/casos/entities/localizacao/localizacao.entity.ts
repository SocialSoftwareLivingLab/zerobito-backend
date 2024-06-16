import { Column } from 'typeorm';

export default class LocalizacaoCaso {
  @Column({ name: 'cidade', type: 'text', nullable: true })
  cidade: string;

  @Column({ name: 'estado', type: 'text', nullable: true })
  estado: string;

  @Column({ name: 'logradouro', type: 'text', nullable: true })
  logradouro: string;

  @Column({ name: 'latitude', nullable: true })
  latitude: number;

  @Column({ name: 'longitude', nullable: true })
  longitude: number;
}
