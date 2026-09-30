import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoController } from '../controller/demo.controller'; 
import { DemoService } from '../service/demo.service';
import { Usuario } from '../user/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])], // Registra la entidad
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}