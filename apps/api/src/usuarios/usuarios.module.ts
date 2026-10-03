import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { CatalogosModule } from '../catalogos/catalogos.module';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), CatalogosModule],
  controllers: [UsuariosController], // Solo el controlador real
  providers: [UsuariosService],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}