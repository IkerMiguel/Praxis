import { Controller, Get, Query } from '@nestjs/common';

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

    return {
      nombreUsuario: "Ing. Carlos Mendoza",
      sede: "Sede Cali",
      campusLabel: "CAMPUS CALI",
      periodoActivo: true,
      solicitudesActivas: 3,
      enProceso: 2,
      pendienteInformacion: 1,
      porcentajeAtencion: 66 
    };
  }
}