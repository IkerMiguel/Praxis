import { Controller, Get, Query, Post, Body, HttpException, HttpStatus, Param } from '@nestjs/common';

export enum EstadoTicket {
  EN_PROCESO = 'EN_PROCESO',
  PENDIENTE_INFORMACION = 'PENDIENTE_INFORMACION',
  RESUELTO = 'RESUELTO',
}

export enum AccionTicket {
  VER_DETALLE = 'VER_DETALLE',
  COMPLETAR_INFORMACION = 'COMPLETAR_INFORMACION',
}

// INTERFACES

export interface ReporteReciente {
  id: string;
  estado: EstadoTicket;
  titulo: string;
  actualizadoHace: string;
  ubicacion: string;
  meta: string;
  accionPrincipal: AccionTicket;
  mensajeAlerta?: string; 
}

export interface TrazabilidadItem {
  estado: string;
  fecha: string;
  descripcion: string;
}

export interface DetalleReporte extends ReporteReciente {
  campus: string;
  ubicacionFisica: string;
  categoria: string;
  fechaRadicacion: string;
  descripcionInicial: string;
  evidencias: string[];
  requerimientoTecnico?: string;
  trazabilidad: TrazabilidadItem[];
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

export interface CompletarInformacionPayload {
  respuestaTexto: string;
  fotosAdicionales?: string[];
}

export interface CompletarInformacionRespuesta {
  exito: boolean;
  mensaje: string;
  nuevoEstado: EstadoTicket;
}

// CONTROLADOR 

@Controller('reportes')
export class ReportesController {
  
  // ---------------------------------------------------------
  // ENDPOINT 1: LISTADO -> GET /reportes/solicitudes
  // ---------------------------------------------------------
  @Get('solicitudes')
  obtenerListado(@Query('estado') estado?: string): ReporteReciente[] {
    
    if (estado === 'error') {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Fallo al cargar las solicitudes',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (estado === 'vacio') {
      return [];
    }

    return [
      {
        id: "TKT-2026-0472",
        estado: EstadoTicket.PENDIENTE_INFORMACION,
        titulo: "Lámpara LED parpadeante en Lab 302",
        actualizadoHace: "Ayer, 16:30",
        ubicacion: "Sede Cali • Bloque B • Lab Sistemas 302",
        meta: "Cuadrilla Eléctrica",
        accionPrincipal: AccionTicket.COMPLETAR_INFORMACION,
        mensajeAlerta: "Reclamo técnico: requiere aclaración de balastro"
      },
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
        id: "TKT-2026-0450",
        estado: EstadoTicket.RESUELTO,
        titulo: "Cerradura averiada en Aula Magna 101",
        actualizadoHace: "02 Mar 2026",
        ubicacion: "Sede Cali • Bloque C • Aula Magna",
        meta: "Cerrajería",
        accionPrincipal: AccionTicket.VER_DETALLE,
        mensajeAlerta: "Conformidad firmada"
      }
    ];
  }

  // ---------------------------------------------------------
  // ENDPOINT 2: DETALLE -> GET /reportes/solicitudes/:id
  // ---------------------------------------------------------
  @Get('solicitudes/:id')
  obtenerDetalle(@Param('id') id: string): DetalleReporte {
    
    if (id !== 'TKT-2026-0472') {
      throw new HttpException('Ticket no encontrado', HttpStatus.NOT_FOUND);
    }

    return {
        id: "TKT-2026-0472",
        estado: EstadoTicket.PENDIENTE_INFORMACION,
        titulo: "Lámpara LED parpadeante en Lab 302",
        actualizadoHace: "Ayer, 16:30",
        ubicacion: "Sede Cali • Bloque B • Lab Sistemas 302",
        meta: "Cuadrilla Eléctrica",
        accionPrincipal: AccionTicket.COMPLETAR_INFORMACION,
        mensajeAlerta: "Acción Requerida del Solicitante",
        campus: "Universidad ECCI - Campus Cali",
        ubicacionFisica: "Bloque B • Lab Sistemas 302",
        categoria: "Electricidad / Iluminación",
        fechaRadicacion: "03 de Marzo de 2026 • 10:45 AM",
        descripcionInicial: "Se evidencia sobrecalentamiento y parpadeo constante en dos paneles de luminarias fluorescentes del techo sobre la fila de computadores 3 a 6. Emite zumbido intermitente.",
        evidencias: ["panel_fallas.jpg", "techo_lab.jpg"],
        requerimientoTecnico: "El técnico Juan Pérez indica: 'Por favor confirmar si la luminaria genera olor a recalentado o interfiere con los computadores 3 a 6.'",
        trazabilidad: [
          {
            estado: "Pendiente de Información",
            fecha: "03 Mar • 16:30",
            descripcion: "Solicitud de aclaración enviada al solicitante."
          },
          {
            estado: "Validado por Cuadrilla Eléctrica",
            fecha: "03 Mar • 14:10",
            descripcion: "Asignado a técnico Juan Pérez."
          },
          {
            estado: "Reporte Registrado",
            fecha: "03 Mar • 10:45",
            descripcion: "Radicado exitosamente por Ing. Carlos Mendoza."
          }
        ]
    };
  }

  // ---------------------------------------------------------
  // ENDPOINT 3: CREAR -> POST /reportes/crear
  // ---------------------------------------------------------
  @Post('crear')
  crearReporte(@Body() payload: CrearReportePayload): ConfirmacionReporteRespuesta {
    
    const erroresValidacion: Record<string, string> = {};

    if (!payload.categoriaSitioId) {
      erroresValidacion['categoriaSitioId'] = 'La categoría principal es obligatoria.';
    }
    if (!payload.clasificacion) {
      erroresValidacion['clasificacion'] = 'Debes seleccionar una subcategoría o clasificación.';
    }
    if (!payload.descripcion || payload.descripcion.length < 15) {
      erroresValidacion['descripcion'] = 'La descripción detallada es obligatoria (mín. 15 caracteres).';
    }

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

  // ---------------------------------------------------------
  // ENDPOINT 4: COMPLETAR -> POST /reportes/solicitudes/:id/completar
  // ---------------------------------------------------------
  @Post('solicitudes/:id/completar')
  completarInformacion(
    @Param('id') id: string,
    @Body() payload: CompletarInformacionPayload
  ): CompletarInformacionRespuesta {
    
    const erroresValidacion: Record<string, string> = {};

    if (!payload.respuestaTexto || payload.respuestaTexto.trim().length < 5) {
      erroresValidacion['respuestaTexto'] = 'La aclaración o respuesta es obligatoria (mínimo 5 caracteres).';
    }

    if (Object.keys(erroresValidacion).length > 0) {
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validación fallida al completar información',
        errores: erroresValidacion 
      }, HttpStatus.BAD_REQUEST);
    }

    return {
      exito: true,
      mensaje: 'Información enviada exitosamente. El área técnica ha sido notificada.',
      nuevoEstado: EstadoTicket.EN_PROCESO 
    };
  }
}