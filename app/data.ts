// Fuente de verdad para todos los datos del Plan de Sistemas 2026
// Extraído del PDF: PRESENTACION-2026-PLAN-DE-SISTEMAS.pdf

export interface BudgetItem {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  monthlyCosts: number[]; // Array de 12 posiciones, una por mes (Ene-Dic)
  total: number;
}

export interface BudgetCategory {
  id: string;
  title: string;
  items: BudgetItem[];
  total: number;
  percentage: string;
}

export const PLAN_2026_DATA: BudgetCategory[] = [
  {
    id: "cat-1",
    title: "SOFTWARE, PROGRAMACIÓN Y RENOVACIÓN DE LICENCIAS",
    total: 5980,
    percentage: "22%",
    items: [
      {
        id: "item-1-1",
        description: "Licencias por 3 años del Antivirus",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3000],
        total: 3000
      },
      {
        id: "item-1-2",
        description: "Renovación Anual Servidor de Correo y Web",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 250],
        total: 250
      },
      {
        id: "item-1-3",
        description: "Renovación Licencia Anual Saint",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 400],
        total: 400
      },
      {
        id: "item-1-4",
        description: "Config. y Mejoras de Programación del Router Principal",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 750],
        total: 750
      },
      {
        id: "item-1-5",
        description: "Implementación Fase Final de Saint Nómina",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1280],
        total: 1280
      },
      {
        id: "item-1-6",
        description: "Contratación de Espacio de Almacenamiento en la Nube",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 300],
        total: 300
      }
    ]
  },
  {
    id: "cat-2",
    title: "INFRAESTRUCTURA DE REDES, PCS, IMPRESORAS E INTERNET",
    total: 14950,
    percentage: "54%",
    items: [
      {
        id: "item-2-1",
        description: "Servidor HPE ProLiant DL360",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6000],
        total: 6000
      },
      {
        id: "item-2-2",
        description: "Sustitución de Switches 24 Puertos",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1200],
        total: 1200
      },
      {
        id: "item-2-3",
        description: "Router Mikrotik RB3011UiAS (Backup)",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 380],
        total: 380
      },
      {
        id: "item-2-4",
        description: "Equipos PC - CPU + Monitor + Teclado + Ratón",
        status: 'pending',
        monthlyCosts: [200, 100, 300, 300, 300, 600, 920, 0, 0, 0, 0, 0],
        total: 2720
      },
      {
        id: "item-2-5",
        description: "Impresora Matriz de Puntos",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 370],
        total: 370
      },
      {
        id: "item-2-6",
        description: "Impresora Multifuncional",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 600, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 600
      },
      {
        id: "item-2-7",
        description: "Impresoras Personales",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 850],
        total: 850
      },
      {
        id: "item-2-8",
        description: "Nuevos UPS Centro Diagnóstico y Pediatría",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 650],
        total: 650
      },
      {
        id: "item-2-9",
        description: "Baterías Nuevas para los UPS de la Red y Servidores",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 550],
        total: 550
      },
      {
        id: "item-2-10",
        description: "Rep. y Mant. de Fotocopiadoras",
        status: 'pending',
        monthlyCosts: [270, 270, 270, 270, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 1080
      },
      {
        id: "item-2-11",
        description: "Mantenimiento y Reparación de Impresoras",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 300],
        total: 300
      },
      {
        id: "item-2-12",
        description: "Reguladores de Voltaje de Remplazo",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125],
        total: 125
      },
      {
        id: "item-2-13",
        description: "Fuentes de Poder 500W",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125],
        total: 125
      }
    ]
  },
  {
    id: "cat-3",
    title: "TELEFONÍA",
    total: 1088,
    percentage: "4%",
    items: [
      {
        id: "item-3-1",
        description: "Reposición Teléfonos Analógicos",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168],
        total: 168
      },
      {
        id: "item-3-2",
        description: "Mantenimiento General de Puntos de Acceso Telefónico",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 320],
        total: 320
      },
      {
        id: "item-3-3",
        description: "Mantenimiento de la Central (Apartado)",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 600],
        total: 600
      }
    ]
  },
  {
    id: "cat-4",
    title: "CÁMARAS DE SEGURIDAD",
    total: 4100,
    percentage: "15%",
    items: [
      {
        id: "item-4-1",
        description: "Mantenimiento Anual del Sistema de Video Vigilancia",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 600],
        total: 600
      },
      {
        id: "item-4-2",
        description: "Ampliación de los Puntos de la Video Vigilancia",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3500],
        total: 3500
      }
    ]

  },
  {
    id: "cat-5",
    title: "HERRAMIENTAS Y MEJORAS",
    total: 1416,
    percentage: "5%",
    items: [
      {
        id: "item-5-1",
        description: "Smart TV 50 pulgadas",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 340, 0, 0, 0, 0, 0, 0, 0],
        total: 340
      },
      {
        id: "item-5-2",
        description: "Ratón y Teclado Inalámbrico",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30],
        total: 30
      },
      {
        id: "item-5-3",
        description: "Micrófono Inalámbrico (Opcional)",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50],
        total: 50
      },
      {
        id: "item-5-4",
        description: "Biométrico más Instalación Puerta Admin",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 380],
        total: 380
      },
      {
        id: "item-5-5",
        description: "Estación de Soldadura",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140],
        total: 140
      },
      {
        id: "item-5-6",
        description: "Convertidor de SATA/USB",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16],
        total: 16
      },
      {
        id: "item-5-7",
        description: "Adaptador de Disco Duro SAS a SATA",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20],
        total: 20
      },
      {
        id: "item-5-8",
        description: "Adaptador Display Port Macho a VGA",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20],
        total: 20
      },
      {
        id: "item-5-9",
        description: "Discos Sólidos 240 GB",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 350],
        total: 350
      },
      {
        id: "item-5-10",
        description: "Enclosure Disco Duro 2.5/3.5 USB 3.0",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40],
        total: 40
      },
      {
        id: "item-5-11",
        description: "Kit de Destornilladores",
        status: 'pending',
        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30],
        total: 30
      }
    ]
  }
];

// Totales mensuales calculados
export const MONTHLY_TOTALS = [470, 370, 570, 1170, 640, 600, 920, 0, 0, 0, 0, 22794];

// Total general del presupuesto
export const GRAND_TOTAL = 27534;
