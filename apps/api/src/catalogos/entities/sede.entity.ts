import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sedes')
export class Sede {
  @PrimaryGeneratedColumn({ name: 'id_sede' })
  idSede: number;

  @Column({ name: 'nombre_sede', type: 'varchar', length: 100 })
  nombreSede: string;

  @Column({ name: 'campus_label', type: 'varchar', length: 150, nullable: true })
  campusLabel: string;
}