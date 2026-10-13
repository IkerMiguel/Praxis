import { Controller, Get, Query, Post, Body, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import type {
  ReporteReciente,
  DetalleReporte,
  CrearReportePayload,
  ConfirmacionReporteRespuesta,
  CompletarInformacionPayload,
  CompletarInformacionRespuesta,
} from './reportes.service';

// Re-exportamos los tipos/enum para no romper imports existentes.
export { EstadoTicket, AccionTicket } from './reportes.service';
export type { ReporteReciente, DetalleReporte, TrazabilidadItem } from './reportes.service';

// CONTROLADOR

@Controller('reportes')
export class ReportesController {

  constructor(private readonly reportes: ReportesService) {}

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

    return this.reportes.listar(estado, categoria);
  }

  // ---------------------------------------------------------
  // ENDPOINT: CONTADOR -> GET /reportes/contador
  // ---------------------------------------------------------
  @Get('contador')
  obtenerContador(): { pendienteInformacion: number } {
    const { pendienteInformacion } = this.reportes.contar();
    return { pendienteInformacion };
  }

  // ---------------------------------------------------------
  // ENDPOINT 2: DETALLE -> GET /reportes/solicitudes/:id
  // ---------------------------------------------------------
  @Get('solicitudes/:id')
  obtenerDetalle(@Param('id') id: string): DetalleReporte {
    return this.reportes.detalle(id);
  }

  // ---------------------------------------------------------
  // ENDPOINT 3: CREAR -> POST /reportes/crear
  // ---------------------------------------------------------
  @Post('crear')
  crearReporte(@Body() payload: CrearReportePayload): ConfirmacionReporteRespuesta {
    return this.reportes.crear(payload);
  }

  // ---------------------------------------------------------
  // ENDPOINT 4: COMPLETAR -> POST /reportes/solicitudes/:id/completar
  // ---------------------------------------------------------
  @Post('solicitudes/:id/completar')
  completarInformacion(
    @Param('id') id: string,
    @Body() payload: CompletarInformacionPayload
  ): CompletarInformacionRespuesta {
    return this.reportes.completar(id, payload);
  }
}
