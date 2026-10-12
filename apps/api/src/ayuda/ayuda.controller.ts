import { Controller, Get } from '@nestjs/common';

export interface PasoAyuda {
  orden: number;
  titulo: string;
  descripcion: string;
}

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

export interface MaterialAyuda {
  tituloGeneral: string;
  enlaceManualInstitucional: string | null; // Opcional según requerimiento
  pasosReporte: PasoAyuda[];
  faqs: PreguntaFrecuente[];
}


@Controller('ayuda')
export class AyudaController {
  
  // Responde a: GET ayuda/material
  @Get('material')
  obtenerMaterialAyuda(): MaterialAyuda {
    
    return {
      tituloGeneral: "Centro de Ayuda - Reporte de Fallas",
      enlaceManualInstitucional: "https://www.ecci.edu.co/es/",
      pasosReporte: [
        {
          orden: 1,
          titulo: "Identifica el daño",
          descripcion: "Verifica si la falla es física (mobiliario), eléctrica, hidráulica o tecnológica."
        },
        {
          orden: 2,
          titulo: "Inicia tu reporte",
          descripcion: "Haz clic en 'Nuevo Reporte' desde tu panel principal e ingresa la ubicación exacta del daño."
        },
        {
          orden: 3,
          titulo: "Adjunta evidencia",
          descripcion: "Toma una o más fotos claras del problema. Esto ayuda a los técnicos a llevar los materiales adecuados."
        },
        {
          orden: 4,
          titulo: "Envía y haz seguimiento",
          descripcion: "Una vez enviado, recibirás un número de ticket. Puedes ver el estado en la sección 'Mis solicitudes'."
        }
      ],
      faqs: [
        {
          pregunta: "¿Qué hago si mi reporte lleva mucho tiempo 'Pendiente de Información'?",
          respuesta: "Revisa el detalle de tu solicitud, es posible que el técnico haya solicitado fotos adicionales o una descripción más clara para poder actuar."
        },
        {
          pregunta: "¿Puedo reportar daños fuera del campus?",
          respuesta: "No, este sistema es exclusivo para la infraestructura interna del Campus Universitario."
        }
      ]
    };
  }
}