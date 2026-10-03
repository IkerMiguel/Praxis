import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from '../../catalogos/entities/rol.entity';
import { Sede } from '../../catalogos/entities/sede.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  idUsuario: number;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @ManyToOne(() => Sede)
  @JoinColumn({ name: 'id_sede' })
  sede: Sede;

  @Column({ name: 'nombre_completo', type: 'varchar', length: 150 })
  nombreCompleto: string;

  @Column({ name: 'correo_institucional', type: 'varchar', length: 150, unique: true })
  correoInstitucional: string;

  @Column({ name: 'contrasena', type: 'varchar', length: 255 })
  contrasena: string;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string;
}