import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 50 })
  rol: string;

  @Column({ type: 'varchar', length: 50 })
  sede: string;

  @Column({ name: 'campus_label', type: 'varchar', length: 100 })
  campusLabel: string;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string;
}