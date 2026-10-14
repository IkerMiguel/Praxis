import { Controller, Get, Query, Post, HttpCode } from '@nestjs/common';


export interface ResumenNotificaciones {
  // Este dato es EXCLUSIVO para la campana de notificaciones.
  // NO debe confundirse ni reutilizarse para el badge de "Mis solicitudes" en el menú.
  notificacionesPendientes: number;
}

export interface ItemNotificacion {
  id: string;
  tipo: 'ASIGNACION' | 'COMENTARIO' | 'SOLICITUD_INFORMACION';
  titulo: string;
  mensaje: string;
  ticketId: string;
  tiempo: string;
  leida: boolean;
}

export interface ListadoNotificaciones {
  items: ItemNotificacion[];
}

// BASE MOCK EN MEMORIA
// El listado vive en memoria para que "Marcar todas como leídas"
// ponga el conteo en cero hasta que el backend real notifique otra vez.

function crearBase(): ItemNotificacion[] {
  return [
    {
      id: 'NTF-001',
      tipo: 'SOLICITUD_INFORMACION',
      titulo: 'Req. Información',
      mensaje: 'Reclamo técnico: requiere aclaración de balastro',
      ticketId: 'TKT-2026-0472',
      tiempo: 'hace 45 min',
      leida: false,
    },
    {
      id: 'NTF-002',
      tipo: 'ASIGNACION',
      titulo: 'En proceso',
      mensaje: 'Coordinador asignó cuadrilla técnica',
      ticketId: 'TKT-2026-0489',
      tiempo: 'hace 1h',
      leida: false,
    },
    {
      id: 'NTF-003',
      tipo: 'COMENTARIO',
      titulo: 'Nuevo comentario',
      mensaje: 'Lámpara LED parpadeante en Lab 302',
      ticketId: 'TKT-2026-0472',
      tiempo: 'hace 2h',
      leida: false,
    },
  ];
}

@Controller('notificaciones')
export class NotificacionesController {

  private readonly base = crearBase();

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
      notificacionesPendientes: this.base.filter((n) => !n.leida).length,
    };
  }

  // Responde a: GET notificaciones/listado
  // Alimenta el popover de la campana con las notificaciones reales del usuario.
  @Get('listado')
  obtenerListado(): ListadoNotificaciones {
    return {
      items: this.base,
    };
  }

  // Responde a: POST notificaciones/marcar-leidas
  // Deja el conteo de la campana en cero (hasta la siguiente notificación).
  @Post('marcar-leidas')
  @HttpCode(200)
  marcarLeidas(): ResumenNotificaciones {
    for (const item of this.base) {
      item.leida = true;
    }

    return {
      notificacionesPendientes: 0,
    };
  }
}
