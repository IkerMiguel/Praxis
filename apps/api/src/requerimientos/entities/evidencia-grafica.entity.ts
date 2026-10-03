import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Requerimiento } from './requerimiento.entity';

@Entity('evidencias_graficas')
export class EvidenciaGrafica {
  @PrimaryGeneratedColumn({ name: 'id_evidencia' })
  idEvidencia: number;

  @ManyToOne(() => Requerimiento, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_ticket' })
  requerimiento: Requerimiento;

  @Column({ name: 'url_archivo', type: 'text' })
  urlArchivo: string;

  @Column({ name: 'tipo_evidencia', type: 'varchar', length: 50 })
  tipoEvidencia: string;
}