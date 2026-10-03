import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async getMe() {
    // Aquí simulamos que obtenemos el usuario logueado (más adelante esto vendrá del token JWT)
    const usuario = await this.usuarioRepository.findOne({
      where: { correoInstitucional: 'cmendoza@ecci.edu.co' },
      // 'relations' hace el JOIN automáticamente con las tablas Roles y Sedes
      relations: ['rol', 'sede'], 
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado en la base de datos');
    }

    // Formateamos la respuesta para que coincida EXACTAMENTE con el contrato del Mokup 1
    return {
      nombre: usuario.nombreCompleto,
      rol: usuario.rol?.nombreRol || 'Sin rol',
      sede: usuario.sede?.nombreSede || 'Sin sede',
      campusLabel: usuario.sede?.campusLabel || 'Sin campus',
      avatarUrl: usuario.avatarUrl,
    };
  }
}