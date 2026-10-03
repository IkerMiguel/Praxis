import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Categoria } from '../../catalogos/entities/categoria.entity';

@Entity('requerimientos')
export class Requerimiento {
  @PrimaryColumn({ name: 'numero_ticket', type: 'varchar', length: 20 })
  numeroTicket: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_solicitante' })
  solicitante: Usuario;

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: 'id_categoria' })
  categoria: Categoria;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'id_tecnico' })
  tecnico: Usuario;

  @Column({ name: 'ubicacion', type: 'varchar', length: 255 })
  ubicacion: string;

  @Column({ name: 'descripcion_dano', type: 'text' })
  descripcionDano: string;

  @Column({ name: 'estado', type: 'varchar', length: 50, default: 'Abierto' })
  estado: string;

  @Column({ name: 'prioridad', type: 'varchar', length: 50, nullable: true })
  prioridad: string;

  @Column({ name: 'riesgo_sst', type: 'boolean', default: false })
  riesgoSst: boolean;

  @CreateDateColumn({ name: 'fecha_reporte', type: 'timestamp' })
  fechaReporte: Date;

  @Column({ name: 'fecha_asignacion', type: 'timestamp', nullable: true })
  fechaAsignacion: Date;

  @Column({ name: 'fecha_cierre', type: 'timestamp', nullable: true })
  fechaCierre: Date;

  @Column({ name: 'solucion_aplicada', type: 'text', nullable: true })
  solucionAplicada: string;
}