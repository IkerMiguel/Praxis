import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { Sede } from './entities/sede.entity';
import { Categoria } from './entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rol, Sede, Categoria])],
  exports: [TypeOrmModule],
})
export class CatalogosModule {}