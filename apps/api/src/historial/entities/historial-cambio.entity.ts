import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Requerimiento } from '../../requerimientos/entities/requerimiento.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('historial_cambios')
export class HistorialCambio {
  @PrimaryGeneratedColumn({ name: 'id_historial' })
  idHistorial: number;

  @ManyToOne(() => Requerimiento, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_ticket' })
  requerimiento: Requerimiento;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @CreateDateColumn({ name: 'fecha', type: 'date' })
  fecha: Date;

  @Column({ name: 'hora', type: 'time', default: () => 'CURRENT_TIME' })
  hora: string;

  @Column({ name: 'estado_anterior', type: 'varchar', length: 50, nullable: true })
  estadoAnterior: string;

  @Column({ name: 'estado_nuevo', type: 'varchar', length: 50 })
  estadoNuevo: string;

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones: string;
}