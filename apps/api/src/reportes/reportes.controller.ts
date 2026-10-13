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

export interface ReporteReciente {
  id: string;
  estado: EstadoTicket;
  titulo: string;
  actualizadoHace: string;
  ubicacion: string;
  meta: string;
  accionPrincipal: AccionTicket;
  mensajeAlerta?: string; // Para mostrar ej: "Reclamo técnico: requiere aclaración..."
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
  requerimientoTecnico?: string; // Solo si está Pendiente de Información
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

// =====================================================================
// CONTROLADOR
// =====================================================================
@Controller('reportes')
export class ReportesController {
  
  // ---------------------------------------------------------
  // ENDPOINT 1: LISTADO GET reportes/solicitudes
  // ---------------------------------------------------------
  @Get('solicitudes')
  obtenerListado(@Query('estado') estado?: string): ReporteReciente[] {
    
    // Escenario: Variante error documentada
    if (estado === 'error') {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Fallo al cargar las solicitudes',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Escenario: Lista vacía documentada (Mokcup "Aún no tienes solicitudes")
    if (estado === 'vacio') {
      return [];
    }

    // Escenario: Listado consumible (Mockup principal Mis Solicitudes)
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
  // ENDPOINT 2: DETALLE GET /reportes/solicitudes/:id
  // ---------------------------------------------------------
  @Get('solicitudes/:id')
  obtenerDetalle(@Param('id') id: string): DetalleReporte {
    
    // Si buscan un ID que no existe en el mock, devolvemos 404
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
        
        // Campos específicos del detalle
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
  // ENDPOINT 3: POST /reportes/crear
  // ---------------------------------------------------------
  @Post('crear')
  crearReporte(@Body() payload: CrearReportePayload): ConfirmacionReporteRespuesta {
    // ... (Mantén tu código de validación y éxito aquí)
    return {
      id: '#TKT-2026-0492',
      fechaRegistro: new Date().toISOString(),
      estadoInicial: 'Abierto • En Validación',
      categoria: 'Electricidad' 
    };
  }
}