// Paleta de colores consistente para categorías
// Usada en KPI Cards, Gráficos y toda la UI

export const CATEGORY_COLORS = {
    INFRAESTRUCTURA: {
        primary: '#3b82f6', // blue-500
        light: '#dbeafe',   // blue-50
        medium: '#93c5fd',  // blue-300
        dark: '#1e40af',    // blue-700
    },
    SOFTWARE: {
        primary: '#10b981', // emerald-500
        light: '#d1fae5',   // emerald-50
        medium: '#6ee7b7',  // emerald-300
        dark: '#047857',    // emerald-700
    },
    TELEFONIA: {
        primary: '#f59e0b', // amber-500
        light: '#fef3c7',   // amber-50
        medium: '#fcd34d',  // amber-300
        dark: '#b45309',    // amber-700
    },
    CAMARAS: {
        primary: '#8b5cf6', // violet-500
        light: '#ede9fe',   // violet-50
        medium: '#c4b5fd',  // violet-300
        dark: '#6d28d9',    // violet-700
    },
    HERRAMIENTAS: {
        primary: '#ec4899', // pink-500
        light: '#fce7f3',   // pink-50
        medium: '#f9a8d4',  // pink-300
        dark: '#be185d',    // pink-700
    },
} as const;

// Mapeo de títulos de categorías a colores
export const getCategoryColor = (categoryTitle: string) => {
    if (categoryTitle.includes('INFRAESTRUCTURA')) return CATEGORY_COLORS.INFRAESTRUCTURA;
    if (categoryTitle.includes('SOFTWARE')) return CATEGORY_COLORS.SOFTWARE;
    if (categoryTitle.includes('TELEFONÍA')) return CATEGORY_COLORS.TELEFONIA;
    if (categoryTitle.includes('CÁMARAS')) return CATEGORY_COLORS.CAMARAS;
    if (categoryTitle.includes('HERRAMIENTAS')) return CATEGORY_COLORS.HERRAMIENTAS;
    return CATEGORY_COLORS.INFRAESTRUCTURA; // fallback
};
