import { Controller, Get, Query } from '@nestjs/common';

export enum EstadoTicket {

  EN_PROCESO = 'EN_PROCESO',
  
  PENDIENTE_INFORMACION = 'PENDIENTE_INFORMACION',
  
  RESUELTO = 'RESUELTO',
}

export enum AccionTicket {
  VER_DETALLE = 'VER_DETALLE',
  COMPLETAR_INFORMACION = 'COMPLETAR_INFORMACION',
}



export interface ReporteReciente {
  id: string;
  estado: EstadoTicket;
  titulo: string;
  actualizadoHace: string;
  ubicacion: string;
  meta: string;
  accionPrincipal: AccionTicket;
}


@Controller('reportes')
export class ReportesController {
  
  // Responde a: GET /reportes/recientes
  @Get('recientes')
  obtenerRecientes(@Query('vacio') vacio?: string): ReporteReciente[] {
    
    // Variante lista vacía disponible para PRAX-33
    if (vacio === 'true') {
      return [];
    }

    return [
      {
        id: "TKT-2026-0489",
        estado: EstadoTicket.EN_PROCESO,
        titulo: "Fuga de agua en lavamanos piso 3",
        actualizadoHace: "Hace 45 min",
        ubicacion: "Sede Cali • Bloque A • Baño Hombres",
        meta: "Cuadrilla Hidráulica 02",
        accionPrincipal: AccionTicket.VER_DETALLE
      },
      {
        id: "TKT-2026-0490",
        estado: EstadoTicket.PENDIENTE_INFORMACION,
        titulo: "Proyector no enciende en Aula 204",
        actualizadoHace: "Hace 2 horas",
        ubicacion: "Sede Cali • Bloque B • Aula 204",
        meta: "Soporte TI",
        accionPrincipal: AccionTicket.COMPLETAR_INFORMACION
      },
      {
        id: "TKT-2026-0475",
        estado: EstadoTicket.RESUELTO,
        titulo: "Luminaria fundida en pasillo principal",
        actualizadoHace: "Hace 1 día",
        ubicacion: "Sede Cali • Bloque C • Pasillo",
        meta: "Cuadrilla Eléctrica 01",
        accionPrincipal: AccionTicket.VER_DETALLE
      }
    ];
  }
}