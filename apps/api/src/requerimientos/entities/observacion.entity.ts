import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Requerimiento } from './requerimiento.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('observaciones')
export class Observacion {
  @PrimaryGeneratedColumn({ name: 'id_observacion' })
  idObservacion: number;

  @ManyToOne(() => Requerimiento, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_ticket' })
  requerimiento: Requerimiento;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ name: 'detalle', type: 'text' })
  detalle: string;

  @CreateDateColumn({ name: 'fecha_ingreso', type: 'timestamp' })
  fechaIngreso: Date;
}