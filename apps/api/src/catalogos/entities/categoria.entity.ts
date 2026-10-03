import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn({ name: 'id_categoria' })
  idCategoria: number;

  @Column({ name: 'nombre_categoria', type: 'varchar', length: 100 })
  nombreCategoria: string;
}