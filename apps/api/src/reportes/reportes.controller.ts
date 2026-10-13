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
  categoria: string;
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
  categoriaTecnica: string;
  fechaRadicacion: string;
  descripcionInicial: string;
  evidencias: string[];
  requerimientoTecnico?: string;
  trazabilidad: TrazabilidadItem[];
}

export interface CrearReportePayload {
  sede: string;
  bloque: string;
  piso: string;
  espacioEspecifico: string;
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
  ubicacion: {
    campus: string;
    bloque: string;
    piso: string;
    espacio: string;
  };
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

// BASE MOCK EN MEMORIA
// El estado vive en memoria para que completar información cambie el
// ticket de PENDIENTE_INFORMACION a EN_PROCESO en listado y detalle.

// Etiquetas del catálogo, usadas para armar el ticket creado.
const CATALOGO_CATEGORIAS: Record<string, { etiqueta: string; corta: string; meta: string }> = {
  'CAT-ELEC': { etiqueta: 'Electricidad / Iluminación', corta: 'Electricidad', meta: 'Cuadrilla Eléctrica' },
  'CAT-HIDR': { etiqueta: 'Hidráulica / Plomería', corta: 'Hidráulica', meta: 'Cuadrilla Hidráulica' },
  'CAT-MOB': { etiqueta: 'Mobiliario / Carpintería', corta: 'Carpintería', meta: 'Cuadrilla Carpintería' },
  'CAT-TEC': { etiqueta: 'Tecnología / Redes y Equipos', corta: 'Redes', meta: 'Cuadrilla Redes' },
  'CAT-INFRA': { etiqueta: 'Infraestructura / Obra Civil', corta: 'Obra Civil', meta: 'Cuadrilla Obra Civil' },
};

const CATALOGO_SUBCATEGORIAS: Record<string, string> = {
  'SUB-ELEC-LUM': 'Luminarias / Paneles de techo',
  'SUB-ELEC-TOM': 'Tomas y cableado',
  'SUB-ELEC-TAB': 'Tableros eléctricos',
  'SUB-ELEC-EME': 'Iluminación de emergencia',
  'SUB-HIDR-FUG': 'Fugas / Goteos',
  'SUB-HIDR-TAN': 'Tanques y cisternas',
  'SUB-HIDR-DRE': 'Drenajes y tuberías',
  'SUB-MOB-MES': 'Mesas y sillas',
  'SUB-MOB-PUE': 'Puertas y cerraduras',
  'SUB-MOB-EST': 'Estanterías / Armarios',
  'SUB-TEC-RED': 'Redes y cableado',
  'SUB-TEC-EQP': 'Equipos de cómputo',
  'SUB-TEC-PRO': 'Proyectores y pantallas',
  'SUB-INF-PIN': 'Pintura',
  'SUB-INF-MUR': 'Muros y pisos',
  'SUB-INF-TEC': 'Techos y estructuras',
};

function crearBase(): Map<string, DetalleReporte> {
  const tickets: DetalleReporte[] = [
    {
      id: "TKT-2026-0472",
      estado: EstadoTicket.PENDIENTE_INFORMACION,
      titulo: "Lámpara LED parpadeante en Lab 302",
      actualizadoHace: "Ayer, 16:30",
      ubicacion: "Sede Cali • Bloque B • Lab Sistemas 302",
      categoria: "Electricidad",
      meta: "Cuadrilla Eléctrica",
      accionPrincipal: AccionTicket.COMPLETAR_INFORMACION,
      mensajeAlerta: "Reclamo técnico: requiere aclaración de balastro",
      campus: "Universidad ECCI - Campus Cali",
      ubicacionFisica: "Bloque B • Lab Sistemas 302",
      categoriaTecnica: "Electricidad / Iluminación",
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
    },
    {
      id: "TKT-2026-0489",
      estado: EstadoTicket.EN_PROCESO,
      titulo: "Fuga de agua en lavamanos piso 3",
      actualizadoHace: "Hace 45 min",
      ubicacion: "Sede Cali • Bloque A • Baño Hombres",
      categoria: "Hidráulica",
      meta: "Cuadrilla Hidráulica 02",
      accionPrincipal: AccionTicket.VER_DETALLE,
      campus: "Universidad ECCI - Campus Cali",
      ubicacionFisica: "Bloque A • Baño Hombres • Piso 3",
      categoriaTecnica: "Hidráulica / Fontanería",
      fechaRadicacion: "13 de Marzo de 2026 • 09:20 AM",
      descripcionInicial: "Fuga constante de agua bajo los lavamanos del baño de hombres en piso 3; el escurrimiento alcanza el pasillo y genera riesgo de resbalón.",
      evidencias: ["fuga_lavamanos.jpg"],
      trazabilidad: [
        {
          estado: "En Proceso",
          fecha: "13 Mar • 10:05",
          descripcion: "Asignado a Cuadrilla Hidráulica 02."
        },
        {
          estado: "Reporte Registrado",
          fecha: "13 Mar • 09:20",
          descripcion: "Radicado exitosamente por Ing. Carlos Mendoza."
        }
      ]
    },
    {
      id: "TKT-2026-0450",
      estado: EstadoTicket.RESUELTO,
      titulo: "Cerradura averiada en Aula Magna 101",
      actualizadoHace: "02 Mar 2026",
      ubicacion: "Sede Cali • Bloque C • Aula Magna",
      categoria: "Cerrajería",
      meta: "Cerrajería",
      accionPrincipal: AccionTicket.VER_DETALLE,
      mensajeAlerta: "Conformidad firmada",
      campus: "Universidad ECCI - Campus Cali",
      ubicacionFisica: "Bloque C • Aula Magna 101",
      categoriaTecnica: "Carpintería / Cerrajería",
      fechaRadicacion: "01 de Marzo de 2026 • 08:15 AM",
      descripcionInicial: "La cerradura del aula no completa el cierre; se requiere reemplazo del cilindro para garantizar el aseguramiento del espacio.",
      evidencias: ["cerradura_aula101.jpg"],
      trazabilidad: [
        {
          estado: "Resuelto",
          fecha: "02 Mar • 12:40",
          descripcion: "Trabajo finalizado. Conformidad firmada por el solicitante."
        },
        {
          estado: "En Proceso",
          fecha: "01 Mar • 15:30",
          descripcion: "Cuadrilla de cerrajería en sitio."
        },
        {
          estado: "Reporte Registrado",
          fecha: "01 Mar • 08:15",
          descripcion: "Radicado exitosamente por Ing. Carlos Mendoza."
        }
      ]
    }
  ];

  return new Map(tickets.map((t) => [t.id, t]));
}

// CONTROLADOR 

@Controller('reportes')
export class ReportesController {

  private readonly base = crearBase();

  // Orden de aparición en el listado (los nuevos van primero).
  private readonly ordenIds: string[] = [
    'TKT-2026-0472', 'TKT-2026-0489', 'TKT-2026-0450',
  ];

  // Siguiente número de ticket a radicar.
  private siguienteNumero = 492;

  // ---------------------------------------------------------
  // ENDPOINT 1: LISTADO -> GET /reportes/solicitudes
  // ---------------------------------------------------------
  @Get('solicitudes')
  obtenerListado(
    @Query('estado') estado?: string,
    @Query('categoria') categoria?: string,
  ): ReporteReciente[] {

    if (estado === 'error') {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Fallo al cargar las solicitudes',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (estado === 'vacio') {
      return [];
    }

    return this.ordenIds
      .map((id) => this.base.get(id))
      .filter((t): t is DetalleReporte => Boolean(t))
      .filter((t) => !categoria || t.categoria.toLowerCase() === categoria.toLowerCase())
      .map((t) => this.aResumen(t));
  }

  // ---------------------------------------------------------
  // ENDPOINT 2: DETALLE -> GET /reportes/solicitudes/:id
  // ---------------------------------------------------------
  @Get('solicitudes/:id')
  obtenerDetalle(@Param('id') id: string): DetalleReporte {

    const ticket = this.base.get(id);

    if (!ticket) {
      throw new HttpException('Ticket no encontrado', HttpStatus.NOT_FOUND);
    }

    return ticket;
  }

  // ---------------------------------------------------------
  // ENDPOINT 3: CREAR -> POST /reportes/crear
  // ---------------------------------------------------------
  @Post('crear')
  crearReporte(@Body() payload: CrearReportePayload): ConfirmacionReporteRespuesta {

    const erroresValidacion: Record<string, string> = {};

    if (!payload.sede) {
      erroresValidacion['sede'] = 'Debes seleccionar la sede / campus.';
    }
    if (!payload.bloque) {
      erroresValidacion['bloque'] = 'Debes seleccionar el bloque / edificio.';
    }
    if (!payload.piso) {
      erroresValidacion['piso'] = 'Debes seleccionar el piso / nivel.';
    }
    if (!payload.espacioEspecifico || payload.espacioEspecifico.trim().length < 5) {
      erroresValidacion['espacioEspecifico'] = 'Describe el espacio específico (mín. 5 caracteres).';
    }
    if (!payload.categoriaSitioId) {
      erroresValidacion['categoriaSitioId'] = 'La categoría principal es obligatoria.';
    }
    if (!payload.clasificacion) {
      erroresValidacion['clasificacion'] = 'Debes seleccionar una subcategoría o clasificación.';
    }
    if (!payload.descripcion || payload.descripcion.trim().length < 15) {
      erroresValidacion['descripcion'] = 'La descripción detallada es obligatoria (mín. 15 caracteres).';
    }

    if (Object.keys(erroresValidacion).length > 0) {
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validación fallida',
        errores: erroresValidacion
      }, HttpStatus.BAD_REQUEST);
    }

    const cat = CATALOGO_CATEGORIAS[payload.categoriaSitioId] ?? CATALOGO_CATEGORIAS['CAT-ELEC'];
    const subEtiqueta = CATALOGO_SUBCATEGORIAS[payload.clasificacion] ?? payload.clasificacion;

    const id = `TKT-2026-0${this.siguienteNumero}`;
    this.siguienteNumero += 1;

    const ahora = new Date();
    const horaLocal = ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const fechaRadicacion = ahora.toLocaleDateString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric',
    }) + ` • ${horaLocal}`;

    const descripcion = payload.descripcion.trim();
    const primeraOracion = descripcion.split(/[.\n]/)[0].trim();
    const titulo = primeraOracion.length > 70
      ? primeraOracion.slice(0, 67) + '…'
      : primeraOracion;

    const campus = payload.sede;
    const ubicacionFisica = `${payload.bloque} • ${payload.piso} • ${payload.espacioEspecifico.trim()}`;
    const campusCorto = campus.replace(/^Universidad ECCI - /, '');

    const ticket: DetalleReporte = {
      id,
      estado: EstadoTicket.EN_PROCESO,
      titulo,
      actualizadoHace: 'Hace unos segundos',
      ubicacion: `Sede ${campusCorto} • ${ubicacionFisica}`,
      categoria: cat.corta,
      meta: cat.meta,
      accionPrincipal: AccionTicket.VER_DETALLE,
      campus,
      ubicacionFisica,
      categoriaTecnica: `${cat.etiqueta} — ${subEtiqueta}`,
      fechaRadicacion,
      descripcionInicial: descripcion,
      evidencias: payload.referenciasEvidencia ?? [],
      trazabilidad: [
        {
          estado: 'Reporte Registrado',
          fecha: `Hoy • ${horaLocal}`,
          descripcion: 'Radicado exitosamente por Ing. Carlos Mendoza.',
        },
      ],
    };

    this.base.set(id, ticket);
    this.ordenIds.unshift(id);

    return {
      id,
      fechaRegistro: ahora.toISOString(),
      estadoInicial: 'Abierto • En Validación',
      categoria: cat.corta,
      ubicacion: {
        campus,
        bloque: payload.bloque,
        piso: payload.piso,
        espacio: payload.espacioEspecifico.trim(),
      },
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

    const ticket = this.base.get(id);

    if (!ticket) {
      throw new HttpException('Ticket no encontrado', HttpStatus.NOT_FOUND);
    }

    // El ticket pendiente pasa a En Proceso con la aclaración del solicitante.
    ticket.estado = EstadoTicket.EN_PROCESO;
    ticket.accionPrincipal = AccionTicket.VER_DETALLE;
    ticket.actualizadoHace = "Hace unos segundos";
    ticket.mensajeAlerta = undefined;
    ticket.requerimientoTecnico = undefined;
    ticket.trazabilidad = [
      {
        estado: "Información Completada",
        fecha: "Hoy • " + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        descripcion: "Aclaración y evidencias enviadas por el solicitante."
      },
      ...ticket.trazabilidad,
    ];

    return {
      exito: true,
      mensaje: 'Información enviada exitosamente. El área técnica ha sido notificada.',
      nuevoEstado: EstadoTicket.EN_PROCESO 
    };
  }

  // Expone solo los campos del listado (sin el detalle pesado).
  private aResumen(t: DetalleReporte): ReporteReciente {
    return {
      id: t.id,
      estado: t.estado,
      titulo: t.titulo,
      actualizadoHace: t.actualizadoHace,
      ubicacion: t.ubicacion,
      categoria: t.categoria,
      meta: t.meta,
      accionPrincipal: t.accionPrincipal,
      mensajeAlerta: t.mensajeAlerta,
    };
  }
}
