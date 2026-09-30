import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../user/usuario.entity';

@Injectable()
export class DemoService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async getDemoUser(): Promise<Usuario> {
    // Aquí buscamos al usuario demo específico. 
    // En un entorno real, esto se haría mediante el ID del token JWT del usuario autenticado.
    const demoUser = await this.usuarioRepository.findOne({
      where: { nombre: 'Ing. Carlos Mendoza' } // Filtro estático para el demo
    });

    if (!demoUser) {
      throw new NotFoundException('Usuario demo no encontrado en la base de datos');
    }

    return demoUser;
  }
}