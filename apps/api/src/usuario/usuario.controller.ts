import { Controller, Get } from '@nestjs/common';

// 1. Defines la interfaz directamente en el backend (sin dependencias externas)
export interface PerfilUsuario {
  nombre: string;
  rol: string;
  sede: string;
  campusLabel: string;
  avatarUrl: string;
}

// 2. Expones la ruta solicitada en el requerimiento
@Controller('user') 
export class UsuarioController {
  
  // Responde a: GET /user/me
  @Get('me')
  obtenerPerfil(): PerfilUsuario {
    
    // 3. Retornas el JSON estático exacto que necesita el frontend
    return {
      nombre: "Ing. Carlos Mendoza",
      rol: "Docente / Solicitante",
      sede: "Sede Cali",
      campusLabel: "Universidad ECCI - Campus Cali",
      avatarUrl: "/assets/avatar.png" 
    };
  }
}