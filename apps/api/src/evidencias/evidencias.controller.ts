import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';


export interface CargaEvidenciaPayload {
  nombreArchivo: string;
  mimeType: string;  // Ej: 'image/jpeg' o 'image/png'
  pesoBytes: number; // Tamaño en bytes
  base64?: string;   // Contenido simulado del archivo
}

export interface RespuestaCarga {
  referencia: string;
  nombreOriginal: string;
  mensaje: string;
  urlSimulada: string;
}


@Controller('evidencias')
export class EvidenciasController {
  
  // Responde a: POST evidencias/cargar
  @Post('cargar')
  subirEvidenciaMock(@Body() payload: CargaEvidenciaPayload): RespuestaCarga {
    
    // Reglas extraídas del DISE (Mockup 3)
    const LIMITE_BYTES = 10 * 1024 * 1024; // 10 MB
    const FORMATOS_PERMITIDOS = ['image/jpeg', 'image/png'];

    // 1. Escenario: Rechazo por tipo (Fuera de tipo definido en DISE)
    if (!FORMATOS_PERMITIDOS.includes(payload.mimeType)) {
      throw new HttpException({
        statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE, // Error 415
        message: 'Formato no admitido. El sistema solo acepta archivos JPG y PNG.',
        campo: 'archivo'
      }, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    // 2. Escenario: Rechazo por tamaño (Supera 10MB)
    if (payload.pesoBytes > LIMITE_BYTES) {
      throw new HttpException({
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE, // Error 413
        message: 'El archivo supera el límite permitido de 10MB por foto.',
        campo: 'archivo'
      }, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    // 3. Escenario: Éxito (Genera la referencia para la creación del ticket)
    // Se crea un string único que servirá como ID temporal del archivo
    const timestamp = Date.now();
    const idReferencia = `ref-evidencia-${timestamp}-${payload.nombreArchivo.replace(/\s+/g, '')}`;

    return {
      referencia: idReferencia,
      nombreOriginal: payload.nombreArchivo,
      mensaje: 'Carga completada exitosamente',
      urlSimulada: `/uploads/mock/${idReferencia}` // URL estática de lectura (Mock)
    };
  }
}