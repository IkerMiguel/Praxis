import type { IconName } from "@/components/icons";

export type FaqItem = {
  id: string;
  pregunta: string;
  respuesta: string;
  nota?: string;
  notaTone?: "brand" | "ink";
  icono: IconName;
};

export const FAQS_AYUDA: FaqItem[] = [
  {
    id: "validacion",
    pregunta: "¿Cuánto tarda en validarse mi solicitud?",
    respuesta:
      "La Coordinación de Mantenimiento revisa y prioriza cada requerimiento con base a los SLA definidos antes de asignar al técnico responsable.",
    nota: "Nota: En casos de fuga de fluidos o riesgo eléctrico inmediato, el tiempo de respuesta prioritario es inferior a 24 horas.",
    icono: "clock",
  },
  {
    id: "fotografias",
    pregunta: "¿Qué tipo de fotografías debo adjuntar en el reporte?",
    respuesta:
      "Se recomienda adjuntar al menos dos fotografías: una toma amplia que muestre el contexto del espacio (para reconocer el entorno o aula) y una toma en primer plano con buena iluminación enfocada en el componente averiado.",
    nota: "Formatos válidos: JPG, PNG o HEIC (hasta 8MB por archivo).",
    notaTone: "ink",
    icono: "image",
  },
  {
    id: "pendiente-informacion",
    pregunta: "¿Qué debo hacer si mi ticket pasa a estado 'Pendiente de Información'?",
    respuesta:
      "Ingresa a la sección Mis Solicitudes, abre el detalle del radicado y revisa el comentario del gestor. Podrás responder con aclaraciones de nomenclatura o adjuntar archivos complementarios requeridos para reanudar el despacho técnico.",
    icono: "edit",
  },
  {
    id: "resuelto",
    pregunta: "¿Cómo sé cuándo fue resuelto el daño reportado?",
    respuesta:
      'El estado del ticket cambiará a "Resuelto" en tu panel, acompañado del registro fotográfico posterior a la intervención de la cuadrilla y el acta de conformidad del área intervenida.',
    icono: "checkCircle",
  },
];
