import { Controller, Get, Query } from '@nestjs/common';


export interface ResumenNotificaciones {
  // Este dato es EXCLUSIVO para la campana de notificaciones.
  // NO debe confundirse ni reutilizarse para el badge de "Mis solicitudes" en el menú.
  notificacionesPendientes: number;
}

@Controller('notificaciones')
export class NotificacionesController {
  
  // Responde a: GET notificaciones/resumen
  // Variante en cero: GET notificaciones/resumen?vacias=true
  @Get('resumen')
  obtenerResumen(@Query('vacias') vacias?: string): ResumenNotificaciones {
    
    // Variante para probar el caso en 0 (la campana no debería mostrar badge)
    if (vacias === 'true') {
      return {
        notificacionesPendientes: 0
      };
    }

    // Caso estándar con valor mayor a 0 (ejemplo: 3 pendientes)
    return {
      notificacionesPendientes: 3
    };
  }
}