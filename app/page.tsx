import React from 'react';
import Image from 'next/image';
import { getCategoryColor } from './colors';
import { calculateGrandTotal, calculateMonthlyTotals } from './utils/budgetCalculations';
import { getBudgetData } from './actions';
import KPICard from '@/components/KPICard';
import BudgetDistributionChart from '@/components/BudgetDistributionChart';
import MonthlyCashFlowChart from '@/components/MonthlyCashFlowChart';
import ExportButton from '@/components/ExportButton';
import PrintHeader from '@/components/PrintHeader';
import PrintReport from '@/components/PrintReport';
import AnimatedNumber from './components/AnimatedNumber';
import BudgetTable from '@/components/BudgetTable';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

// Mapeo de nombres de iconos por categoría
const getCategoryIconName = (categoryTitle: string): 'Server' | 'Code' | 'Phone' | 'Camera' | 'Wrench' => {
  if (categoryTitle.includes('INFRAESTRUCTURA')) return 'Server';
  if (categoryTitle.includes('SOFTWARE')) return 'Code';
  if (categoryTitle.includes('TELEFONÍA')) return 'Phone';
  if (categoryTitle.includes('CÁMARAS')) return 'Camera';
  if (categoryTitle.includes('HERRAMIENTAS')) return 'Wrench';
  return 'Server';
};

export default async function Home() {
  // Fetch data from database
  const budgetData = await getBudgetData();

  // Transform Prisma Decimal types to numbers for calculations and display
  const transformedData = budgetData.map(category => ({
    id: category.id,
    title: category.title,
    total: Number(category.total),
    percentage: category.percentage || '0%',
    items: category.items.map(item => ({
      id: item.id,
      description: item.description,
      status: item.status as 'pending' | 'in-progress' | 'completed',
      monthlyCosts: item.monthlyCosts.map(cost => Number(cost)),
      total: Number(item.total),
    })),
  }));

  // Calculate totals server-side
  const grandTotal = calculateGrandTotal(transformedData);
  const monthlyTotals = calculateMonthlyTotals(transformedData);

  return (
    <main className="min-h-screen">
      {/* SCREEN VIEW - Dashboard */}
      <div className="screen-only max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* PRINT HEADER - Only visible when printing */}
        <PrintHeader />

        {/* HERO SECTION */}
        <header className="text-center mb-12 sm:mb-16">
          {/* Animated Badge */}
          <div className="no-print inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-6 animate-pulse">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-sm font-semibold text-emerald-700">
              Presupuesto 2026
            </span>
          </div>

          {/* Main Title with Logo */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <Image
              src="/ieq-logo.png"
              alt="Clínica IEQ Los Mangos"
              width={240}
              height={120}
              className="w-auto h-24 md:h-32 object-contain"
              priority
            />
            <div className="h-12 w-px bg-slate-300 hidden md:block no-print" />
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter text-center mb-2 drop-shadow-sm">
              Plan de Sistemas <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">202</span><AnimatedNumber />
            </h1>
          </div>

          {/* Subtitle */}
          <div className="no-print max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl text-slate-600 mb-6">
              Dashboard financiero conectado a base de datos en tiempo real
            </p>
          </div>
        </header>

        {/* KPI CARDS GRID */}
        <section className="mb-12 sm:mb-16 print-avoid-break">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {transformedData.map((category, index) => (
              <KPICard
                key={category.id}
                title={category.title}
                amount={category.total}
                percentage={category.percentage}
                iconName={getCategoryIconName(category.title)}
                color={getCategoryColor(category.title)}
                delay={index * 100}
              />
            ))}
          </div>
        </section>

        {/* CHARTS SECTION */}
        <section className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BudgetDistributionChart budgetData={transformedData} />
            <MonthlyCashFlowChart budgetData={transformedData} />
          </div>
        </section>

        {/* EDITABLE TABLE SECTION - Now a Client Component */}
        <BudgetTable
          initialData={transformedData}
          grandTotal={grandTotal}
          monthlyTotals={monthlyTotals}
        />

        {/* FOOTER NOTE */}
        <section className="text-center py-8 px-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              Conectado a Base de Datos
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Todos los cambios se guardan automáticamente en Supabase. Los gráficos y tarjetas KPI se actualizan en tiempo real al editar los valores. Refresca la página (F5) para ver los cambios persistidos.
          </p>
        </section>
      </div>

      {/* PRINT VIEW - Professional Report */}
      <div className="print-only">
        <PrintReport
          budgetData={transformedData}
          grandTotal={grandTotal}
          monthlyTotals={monthlyTotals}
        />
      </div>
    </main>
  );
}
