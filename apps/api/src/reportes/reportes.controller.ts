import { Controller, Get, Query, Post, Body, HttpException, HttpStatus } from '@nestjs/common';


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

export interface CrearReportePayload {
  categoriaSitioId: string;
  clasificacion: string;
  descripcion: string;
  referenciasEvidencia: string[];
}

export interface ConfirmacionReporteRespuesta {
  id: string;
  fechaRegistro: string;
  estadoInicial: string;
  categoria: string;
}


@Controller('reportes')
export class ReportesController {
  
  // ---------------------------------------------------------
  // ENDPOINT 1: GET /reportes/recientes
  // ---------------------------------------------------------
  @Get('recientes')
  obtenerRecientes(@Query('vacio') vacio?: string): ReporteReciente[] {
    
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

  // ---------------------------------------------------------
  // ENDPOINT 2: POST /reportes/crear
  // ---------------------------------------------------------
  @Post('crear')
  crearReporte(@Body() payload: CrearReportePayload): ConfirmacionReporteRespuesta {
    
    const erroresValidacion: Record<string, string> = {};

    // Validaciones para devolver los errores estructurados al frontend
    if (!payload.categoriaSitioId) {
      erroresValidacion['categoriaSitioId'] = 'La categoría principal es obligatoria.';
    }
    
    if (!payload.clasificacion) {
      erroresValidacion['clasificacion'] = 'Debes seleccionar una subcategoría o clasificación.';
    }

    if (!payload.descripcion || payload.descripcion.length < 15) {
      erroresValidacion['descripcion'] = 'La descripción detallada es obligatoria (mín. 15 caracteres).';
    }

    // Si encontramos algún error, lanzamos un 400 Bad Request estructurado
    if (Object.keys(erroresValidacion).length > 0) {
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validación fallida',
        errores: erroresValidacion 
      }, HttpStatus.BAD_REQUEST);
    }

   
    return {
      id: '#TKT-2026-0492', 
      fechaRegistro: new Date().toISOString(),
      estadoInicial: 'Abierto • En Validación',
      categoria: 'Electricidad' 
    };
  }
}