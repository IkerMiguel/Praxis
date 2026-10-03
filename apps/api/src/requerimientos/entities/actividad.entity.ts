import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Requerimiento } from './requerimiento.entity';

@Entity('actividades')
export class Actividad {
  @PrimaryGeneratedColumn({ name: 'id_actividad' })
  idActividad: number;

  @ManyToOne(() => Requerimiento, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_ticket' })
  requerimiento: Requerimiento;

  @Column({ name: 'descripcion', type: 'text' })
  descripcion: string;

  @CreateDateColumn({ name: 'fecha_actividad', type: 'timestamp' })
  fechaActividad: Date;
}