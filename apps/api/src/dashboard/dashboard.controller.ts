import { Controller, Get, Query } from '@nestjs/common';
import { ReportesService } from '../reportes/reportes.service';

// 1. Definimos la interfaz del contrato esperado por el Frontend
export interface ResumenSolicitudes {
  nombreUsuario: string;
  sede: string;
  campusLabel: string;
  periodoActivo: boolean;
  solicitudesActivas: number;
  enProceso: number;
  pendienteInformacion: number;
  porcentajeAtencion: number; 
}

// 2. Definimos la ruta base dashboard
@Controller('dashboard')
export class DashboardController {

  constructor(private readonly reportes: ReportesService) {}

  // Responde a: GET /api/dashboard/resumen
  // Acepta una query opcional para el escenario vacío: /api/dashboard/resumen?vacio=true
  @Get('resumen')
  obtenerResumen(@Query('vacio') vacio?: string): ResumenSolicitudes {
    
    // Variante opcional: Escenario donde todo está en 0
    if (vacio === 'true') {
      return {
        nombreUsuario: "Ing. Carlos Mendoza",
        sede: "Sede Cali",
        campusLabel: "CAMPUS CALI",
        periodoActivo: true,
        solicitudesActivas: 0,
        enProceso: 0,
        pendienteInformacion: 0,
        porcentajeAtencion: 0 
      };
    }

    const { total, enProceso, pendienteInformacion } = this.reportes.contar();
    const atencion = total > 0 ? Math.round((enProceso / total) * 100) : 0;

    return {
      nombreUsuario: "Ing. Carlos Mendoza",
      sede: "Sede Cali",
      campusLabel: "CAMPUS CALI",
      periodoActivo: true,
      solicitudesActivas: total,
      enProceso,
      pendienteInformacion,
      porcentajeAtencion: atencion 
    };
  }
}
