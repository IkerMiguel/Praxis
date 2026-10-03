import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Requerimiento } from './requerimiento.entity';

@Entity('materiales')
export class Material {
  @PrimaryGeneratedColumn({ name: 'id_material' })
  idMaterial: number;

  @ManyToOne(() => Requerimiento, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_ticket' })
  requerimiento: Requerimiento;

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string;

  @Column({ name: 'cantidad', type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones: string;
}