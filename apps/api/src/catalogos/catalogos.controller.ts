import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';

export interface CategoriaSitio {
  id: string;
  etiqueta: string;
}

export interface Subcategoria {
  id: string;
  etiqueta: string;
  categoriaId: string;
}

// Catálogo mock de subcategorías por categoría técnica.
const SUBCATEGORIAS: Subcategoria[] = [
  { id: 'SUB-ELEC-LUM', etiqueta: 'Luminarias / Paneles de techo', categoriaId: 'CAT-ELEC' },
  { id: 'SUB-ELEC-TOM', etiqueta: 'Tomas y cableado', categoriaId: 'CAT-ELEC' },
  { id: 'SUB-ELEC-TAB', etiqueta: 'Tableros eléctricos', categoriaId: 'CAT-ELEC' },
  { id: 'SUB-ELEC-EME', etiqueta: 'Iluminación de emergencia', categoriaId: 'CAT-ELEC' },
  { id: 'SUB-HIDR-FUG', etiqueta: 'Fugas / Goteos', categoriaId: 'CAT-HIDR' },
  { id: 'SUB-HIDR-TAN', etiqueta: 'Tanques y cisternas', categoriaId: 'CAT-HIDR' },
  { id: 'SUB-HIDR-DRE', etiqueta: 'Drenajes y tuberías', categoriaId: 'CAT-HIDR' },
  { id: 'SUB-MOB-MES', etiqueta: 'Mesas y sillas', categoriaId: 'CAT-MOB' },
  { id: 'SUB-MOB-PUE', etiqueta: 'Puertas y cerraduras', categoriaId: 'CAT-MOB' },
  { id: 'SUB-MOB-EST', etiqueta: 'Estanterías / Armarios', categoriaId: 'CAT-MOB' },
  { id: 'SUB-TEC-RED', etiqueta: 'Redes y cableado', categoriaId: 'CAT-TEC' },
  { id: 'SUB-TEC-EQP', etiqueta: 'Equipos de cómputo', categoriaId: 'CAT-TEC' },
  { id: 'SUB-TEC-PRO', etiqueta: 'Proyectores y pantallas', categoriaId: 'CAT-TEC' },
  { id: 'SUB-INF-PIN', etiqueta: 'Pintura', categoriaId: 'CAT-INFRA' },
  { id: 'SUB-INF-MUR', etiqueta: 'Muros y pisos', categoriaId: 'CAT-INFRA' },
  { id: 'SUB-INF-TEC', etiqueta: 'Techos y estructuras', categoriaId: 'CAT-INFRA' },
];


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

  // Responde a: GET catalogos/subcategorias?categoriaId=CAT-ELEC
  // Variante vacía:  GET catalogos/subcategorias?estado=vacio
  // Variante error:  GET catalogos/subcategorias?estado=error
  @Get('subcategorias')
  obtenerSubcategorias(
    @Query('categoriaId') categoriaId?: string,
    @Query('estado') estado?: string,
  ): Subcategoria[] {

    if (estado === 'error') {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Fallo simulado al cargar el catálogo de subcategorías',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (estado === 'vacio') {
      return [];
    }

    if (!categoriaId) {
      return [];
    }

    return SUBCATEGORIAS.filter((s) => s.categoriaId === categoriaId);
  }
}