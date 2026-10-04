import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 1. Importa tu nuevo controlador aquí (ajusta la ruta si guardaste el archivo en otra carpeta)
import { UsuarioController } from './usuario/usuario.controller';

//import { CatalogosModule } from './catalogos/catalogos.module';
//import { UsuariosModule } from './usuarios/usuarios.module';
//import { RequerimientosModule } from './requerimientos/requerimientos.module';
//import { HistorialModule } from './historial/historial.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: Number(config.get('DATABASE_PORT')),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        autoLoadEntities: true, 
        synchronize: true, 
        namingStrategy: new (require('typeorm-naming-strategies').SnakeNamingStrategy)(), 
      }),
    }),
    //CatalogosModule,
    //UsuariosModule,
    //RequerimientosModule,
    //HistorialModule,
  ],
  // 2. Agrega el arreglo controllers y registra tu UsuarioController
  controllers: [UsuarioController],
})
export class AppModule {}