import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialCambio } from './entities/historial-cambio.entity';
import { RequerimientosModule } from '../requerimientos/requerimientos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialCambio]), RequerimientosModule, UsuariosModule],
})
export class HistorialModule {}