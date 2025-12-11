import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * SEED SCRIPT - Plan de Sistemas 2026
 * Datos verificados del PDF oficial
 * Total General: $27,534
 */

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Limpiar datos existentes
    await prisma.budgetItem.deleteMany();
    await prisma.budgetCategory.deleteMany();
    console.log('✅ Datos anteriores eliminados');

    // =========================================================================
    // 1. SOFTWARE Y LICENCIAS - $5,980 (22%)
    // =========================================================================
    const catSoftware = await prisma.budgetCategory.create({
        data: {
            title: 'SOFTWARE, PROGRAMACIÓN Y RENOVACIÓN DE LICENCIAS',
            icon: 'Code',
            color: '#10b981', // green-500
            order: 1,
            total: 5980.00,
            percentage: '22%',
            items: {
                create: [
                    {
                        description: 'Licencias por 3 años del Antivirus',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3000],
                        total: 3000.00
                    },
                    {
                        description: 'Renovación Anual Servidor de Correo y Web',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 250],
                        total: 250.00
                    },
                    {
                        description: 'Renovación Licencia Anual Saint',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 400],
                        total: 400.00
                    },
                    {
                        description: 'Config. y Mejoras de Programación del Router Principal',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 750],
                        total: 750.00
                    },
                    {
                        description: 'Implementación Fase Final de Saint Nómina',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1280],
                        total: 1280.00
                    },
                    {
                        description: 'Contratación de Espacio de Almacenamiento en la Nube',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 300],
                        total: 300.00
                    }
                ]
            }
        }
    });
    console.log(`✅ Categoría creada: ${catSoftware.title}`);

    // =========================================================================
    // 2. INFRAESTRUCTURA DE REDES - $14,950 (54%)
    // =========================================================================
    const catInfra = await prisma.budgetCategory.create({
        data: {
            title: 'INFRAESTRUCTURA DE REDES, PCS, IMPRESORAS E INTERNET',
            icon: 'Server',
            color: '#3b82f6', // blue-500
            order: 2,
            total: 14950.00,
            percentage: '54%',
            items: {
                create: [
                    {
                        description: 'Servidor HPE ProLiant DL360',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6000],
                        total: 6000.00
                    },
                    {
                        description: 'Sustitución de Switches 24 Puertos',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1200],
                        total: 1200.00
                    },
                    {
                        description: 'Router Mikrotik RB3011UiAS (Backup)',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 380],
                        total: 380.00
                    },
                    {
                        description: 'Equipos PC - CPU + Monitor + Teclado + Ratón',
                        status: 'pending',
                        monthlyCosts: [200, 100, 300, 300, 300, 600, 920, 0, 0, 0, 0, 0],
                        total: 2720.00
                    },
                    {
                        description: 'Impresora Matriz de Puntos',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 370],
                        total: 370.00
                    },
                    {
                        description: 'Impresora Multifuncional',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 600, 0, 0, 0, 0, 0, 0, 0, 0],
                        total: 600.00
                    },
                    {
                        description: 'Impresoras Personales',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 850],
                        total: 850.00
                    },
                    {
                        description: 'Nuevos UPS Centro Diagnóstico y Pediatría',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 650],
                        total: 650.00
                    },
                    {
                        description: 'Baterías Nuevas para los UPS de la Red y Servidores',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 550],
                        total: 550.00
                    },
                    {
                        description: 'Rep. y Mant. de Fotocopiadoras',
                        status: 'pending',
                        monthlyCosts: [270, 270, 270, 270, 0, 0, 0, 0, 0, 0, 0, 0],
                        total: 1080.00
                    },
                    {
                        description: 'Mantenimiento y Reparación de Impresoras',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 300],
                        total: 300.00
                    },
                    {
                        description: 'Reguladores de Voltaje de Remplazo',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125],
                        total: 125.00
                    },
                    {
                        description: 'Fuentes de Poder 500W',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125],
                        total: 125.00
                    }
                ]
            }
        }
    });
    console.log(`✅ Categoría creada: ${catInfra.title}`);

    // =========================================================================
    // 3. TELEFONÍA - $1,088 (4%)
    // =========================================================================
    const catTelefonia = await prisma.budgetCategory.create({
        data: {
            title: 'TELEFONÍA',
            icon: 'Phone',
            color: '#ef4444', // red-500
            order: 3,
            total: 1088.00,
            percentage: '4%',
            items: {
                create: [
                    {
                        description: 'Reposición Teléfonos Analógicos',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168],
                        total: 168.00
                    },
                    {
                        description: 'Mantenimiento General de Puntos de Acceso Telefónico',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 320],
                        total: 320.00
                    },
                    {
                        description: 'Mantenimiento de la Central (Apartado)',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 600],
                        total: 600.00
                    }
                ]
            }
        }
    });
    console.log(`✅ Categoría creada: ${catTelefonia.title}`);

    // =========================================================================
    // 4. CÁMARAS DE SEGURIDAD - $4,100 (15%)
    // =========================================================================
    const catCCTV = await prisma.budgetCategory.create({
        data: {
            title: 'CÁMARAS DE SEGURIDAD',
            icon: 'Camera',
            color: '#a855f7', // purple-500
            order: 4,
            total: 4100.00,
            percentage: '15%',
            items: {
                create: [
                    {
                        description: 'Mantenimiento Anual del Sistema de Video Vigilancia',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 600],
                        total: 600.00
                    },
                    {
                        description: 'Ampliación de los Puntos de la Video Vigilancia',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3500],
                        total: 3500.00
                    }
                ]
            }
        }
    });
    console.log(`✅ Categoría creada: ${catCCTV.title}`);

    // =========================================================================
    // 5. HERRAMIENTAS Y MEJORAS - $1,416 (5%)
    // =========================================================================
    const catHerramientas = await prisma.budgetCategory.create({
        data: {
            title: 'HERRAMIENTAS Y MEJORAS',
            icon: 'Wrench',
            color: '#f97316', // orange-500
            order: 5,
            total: 1416.00,
            percentage: '5%',
            items: {
                create: [
                    {
                        description: 'Smart TV 50 pulgadas',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 340, 0, 0, 0, 0, 0, 0, 0],
                        total: 340.00
                    },
                    {
                        description: 'Ratón y Teclado Inalámbrico',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30],
                        total: 30.00
                    },
                    {
                        description: 'Micrófono Inalámbrico (Opcional)',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50],
                        total: 50.00
                    },
                    {
                        description: 'Biométrico más Instalación Puerta Admin',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 380],
                        total: 380.00
                    },
                    {
                        description: 'Estación de Soldadura',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140],
                        total: 140.00
                    },
                    {
                        description: 'Convertidor de SATA/USB',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16],
                        total: 16.00
                    },
                    {
                        description: 'Adaptador de Disco Duro SAS a SATA',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20],
                        total: 20.00
                    },
                    {
                        description: 'Adaptador Display Port Macho a VGA',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20],
                        total: 20.00
                    },
                    {
                        description: 'Discos Sólidos 240 GB',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 350],
                        total: 350.00
                    },
                    {
                        description: 'Enclosure Disco Duro 2.5/3.5 USB 3.0',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40],
                        total: 40.00
                    },
                    {
                        description: 'Kit de Destornilladores',
                        status: 'pending',
                        monthlyCosts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30],
                        total: 30.00
                    }
                ]
            }
        }
    });
    console.log(`✅ Categoría creada: ${catHerramientas.title}`);

    // =========================================================================
    // VERIFICACIÓN DE TOTALES
    // =========================================================================
    const allCategories = await prisma.budgetCategory.findMany({
        include: { items: true }
    });

    let grandTotal = 0;
    console.log('\n📊 Verificación de Totales:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    for (const cat of allCategories) {
        const categoryTotal = cat.items.reduce((sum, item) => sum + Number(item.total), 0);
        grandTotal += categoryTotal;
        console.log(`${cat.title.padEnd(50)} $${categoryTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`${'TOTAL GENERAL'.padEnd(50)} $${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (grandTotal === 27534) {
        console.log('✅ ¡VERIFICACIÓN EXITOSA! El total coincide con el PDF: $27,534.00');
    } else {
        console.log(`❌ ADVERTENCIA: Total calculado ($${grandTotal}) NO coincide con el esperado ($27,534)`);
    }

    console.log('\n✅ Seed completado exitosamente.');
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
