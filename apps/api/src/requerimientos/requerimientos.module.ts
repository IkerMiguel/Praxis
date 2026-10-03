import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requerimiento } from './entities/requerimiento.entity';
import { EvidenciaGrafica } from './entities/evidencia-grafica.entity';
import { Actividad } from './entities/actividad.entity';
import { Material } from './entities/material.entity';
import { Observacion } from './entities/observacion.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { CatalogosModule } from '../catalogos/catalogos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Requerimiento, EvidenciaGrafica, Actividad, Material, Observacion]),
    UsuariosModule,
    CatalogosModule
  ],
  exports: [TypeOrmModule],
})
export class RequerimientosModule {}