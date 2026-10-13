import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';

export interface CategoriaSitio {
  id: string;
  etiqueta: string;
}


@Controller('catalogos')
export class CatalogosController {
  
  // Responde a: GET catalogos/categorias
  // Variante vacía: GET catalogos/categorias?estado=vacio
  // Variante error: GET catalogos/categorias?estado=error
  @Get('categorias')
  obtenerCategorias(@Query('estado') estado?: string): CategoriaSitio[] {
    
    if (estado === 'error') {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Fallo simulado al cargar el catálogo de categorías desde la base de datos',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (estado === 'vacio') {
      return [];
    }

    return [
      {
        id: 'CAT-ELEC',
        etiqueta: 'Electricidad / Iluminación'
      },
      {
        id: 'CAT-HIDR',
        etiqueta: 'Hidráulica / Plomería'
      },
      {
        id: 'CAT-MOB',
        etiqueta: 'Mobiliario / Carpintería'
      },
      {
        id: 'CAT-TEC',
        etiqueta: 'Tecnología / Redes y Equipos'
      },
      {
        id: 'CAT-INFRA',
        etiqueta: 'Infraestructura / Obra Civil'
      }
    ];
  }
}