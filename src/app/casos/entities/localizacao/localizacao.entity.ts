import { Column, Point } from 'typeorm';

export default class LocalizacaoCaso {
  @Column({ name: 'cidade', type: 'text', nullable: true })
  cidade: string;

  @Column({ name: 'estado', type: 'text', nullable: true })
  estado: string;

  @Column({ name: 'logradouro', type: 'text', nullable: true })
  logradouro: string;

  @Column({
    name: 'localizacao',
    nullable: true,
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  localizacao: Point;
}
