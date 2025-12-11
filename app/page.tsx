'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PLAN_2026_DATA, MONTHLY_TOTALS, GRAND_TOTAL, BudgetCategory } from './data';
import { getCategoryColor } from './colors';
import { recalculateBudgetData, calculateGrandTotal, calculateMonthlyTotals, validateCostInput, formatCurrency, addItemToCategory, removeItemFromCategory, updateCategoryTitle } from './utils/budgetCalculations';
import KPICard from '@/components/KPICard';
import BudgetDistributionChart from '@/components/BudgetDistributionChart';
import MonthlyCashFlowChart from '@/components/MonthlyCashFlowChart';
import ExportButton from '@/components/ExportButton';
import PrintHeader from '@/components/PrintHeader';
import PrintReport from '@/components/PrintReport';
import AnimatedNumber from './components/AnimatedNumber';
import { Trash2, Plus, Edit3, Save, RotateCcw } from 'lucide-react';

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const STORAGE_KEY = 'ieq-budget-2026';

// Mapeo de nombres de iconos por categoría
const getCategoryIconName = (categoryTitle: string): 'Server' | 'Code' | 'Phone' | 'Camera' | 'Wrench' => {
  if (categoryTitle.includes('INFRAESTRUCTURA')) return 'Server';
  if (categoryTitle.includes('SOFTWARE')) return 'Code';
  if (categoryTitle.includes('TELEFONÍA')) return 'Phone';
  if (categoryTitle.includes('CÁMARAS')) return 'Camera';
  if (categoryTitle.includes('HERRAMIENTAS')) return 'Wrench';
  return 'Server';
};

export default function Home() {
  // State management
  const [budgetData, setBudgetData] = useState<BudgetCategory[]>(PLAN_2026_DATA);
  const [grandTotal, setGrandTotal] = useState(GRAND_TOTAL);
  const [monthlyTotals, setMonthlyTotals] = useState(MONTHLY_TOTALS);
  const [isEditing, setIsEditing] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Ensure all items have a status (migration for existing data)
        const migratedData = parsedData.map((cat: any) => ({
          ...cat,
          items: cat.items.map((item: any) => ({
            ...item,
            status: item.status || 'pending'
          }))
        }));
        setBudgetData(migratedData);
        setGrandTotal(calculateGrandTotal(migratedData));
        setMonthlyTotals(calculateMonthlyTotals(migratedData));
      } catch (error) {
        console.error('Error loading saved budget data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever budgetData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgetData));
  }, [budgetData]);

  // Handle cost change in table
  const handleCostChange = (
    categoryIndex: number,
    itemIndex: number,
    monthIndex: number,
    newValue: string
  ) => {
    const validated = validateCostInput(newValue);
    if (validated === null) return; // Invalid input, ignore

    // Create new budget data with updated cost
    const newBudgetData = budgetData.map((category, catIdx) => {
      if (catIdx !== categoryIndex) return category;

      return {
        ...category,
        items: category.items.map((item, itmIdx) => {
          if (itmIdx !== itemIndex) return item;

          const newMonthlyCosts = [...item.monthlyCosts];
          newMonthlyCosts[monthIndex] = validated;

          return {
            ...item,
            monthlyCosts: newMonthlyCosts,
            total: 0 // Will be recalculated
          };
        })
      };
    });

    // Recalculate all totals and percentages
    const recalculated = recalculateBudgetData(newBudgetData);

    // Update state
    setBudgetData(recalculated);
    setGrandTotal(calculateGrandTotal(recalculated));
    setMonthlyTotals(calculateMonthlyTotals(recalculated));
  };

  // Reset to original data
  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres restaurar los datos originales? Se perderán todos los cambios.')) {
      setBudgetData(PLAN_2026_DATA);
      setGrandTotal(GRAND_TOTAL);
      setMonthlyTotals(MONTHLY_TOTALS);
      setIsEditing(false); // Reset edit mode
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Add new item to category
  const handleAddItem = (categoryIndex: number) => {
    const newBudgetData = budgetData.map((category, idx) => {
      if (idx !== categoryIndex) return category;
      return addItemToCategory(category);
    });

    const recalculated = recalculateBudgetData(newBudgetData);
    setBudgetData(recalculated);
    setGrandTotal(calculateGrandTotal(recalculated));
    setMonthlyTotals(calculateMonthlyTotals(recalculated));
  };

  // Delete item from category
  const handleDeleteItem = (categoryIndex: number, itemId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este ítem?')) return;

    const newBudgetData = budgetData.map((category, idx) => {
      if (idx !== categoryIndex) return category;
      return removeItemFromCategory(category, itemId);
    });

    const recalculated = recalculateBudgetData(newBudgetData);
    setBudgetData(recalculated);
    setGrandTotal(calculateGrandTotal(recalculated));
    setMonthlyTotals(calculateMonthlyTotals(recalculated));
  };

  // Handle description change
  const handleDescriptionChange = (
    categoryIndex: number,
    itemIndex: number,
    newDescription: string
  ) => {
    const newBudgetData = budgetData.map((category, catIdx) => {
      if (catIdx !== categoryIndex) return category;

      return {
        ...category,
        items: category.items.map((item, itmIdx) => {
          if (itmIdx !== itemIndex) return item;
          return {
            ...item,
            description: newDescription
          };
        })
      };
    });

    setBudgetData(newBudgetData);
  };

  // Handle category title change
  const handleCategoryTitleChange = (categoryIndex: number, newTitle: string) => {
    const newBudgetData = budgetData.map((category, idx) => {
      if (idx !== categoryIndex) return category;
      return updateCategoryTitle(category, newTitle);
    });

    setBudgetData(newBudgetData);
  };

  // Handle status change
  const handleStatusChange = (
    categoryIndex: number,
    itemIndex: number,
    newStatus: 'pending' | 'in-progress' | 'completed'
  ) => {
    const newBudgetData = budgetData.map((category, catIdx) => {
      if (catIdx !== categoryIndex) return category;

      return {
        ...category,
        items: category.items.map((item, itmIdx) => {
          if (itmIdx !== itemIndex) return item;
          return {
            ...item,
            status: newStatus
          };
        })
      };
    });

    setBudgetData(newBudgetData);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Ejecutado</span>;
      case 'in-progress':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">En Curso</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Pendiente</span>;
    }
  };


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
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight text-center mb-2 drop-shadow-sm">
              Plan de Sistemas <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">202</span><AnimatedNumber />
            </h1>
          </div>

          {/* Subtitle */}
          <div className="no-print max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl text-slate-600">
              Dashboard financiero interactivo con edición en tiempo real
            </p>
          </div>
        </header>

        {/* KPI CARDS GRID */}
        <section className="mb-12 sm:mb-16 print-avoid-break">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {budgetData.map((category, index) => (
              <KPICard
                key={category.title}
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
            <BudgetDistributionChart budgetData={budgetData} />
            <MonthlyCashFlowChart budgetData={budgetData} />
          </div>
        </section>

        {/* EDITABLE TABLE SECTION */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Table Header */}
            {/* Table Header with Controls */}
            <div className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Desglose Mensual
                  {isEditing && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                      Modo Edición
                    </span>
                  )}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Gestión detallada de partidas y costos
                </p>
              </div>

              <div className="flex items-center gap-2 no-print">
                {/* Reset Button - Subtle */}
                <button
                  onClick={handleReset}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Restaurar valores originales"
                >
                  <span className="text-xs font-medium mr-1 hidden sm:inline">Restaurar</span>
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1" />

                {/* Edit Toggle */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isEditing
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Guardar</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      <span>Editar</span>
                    </>
                  )}
                </button>

                {/* Export Button */}
                <ExportButton />
              </div>
            </div>

            {/* Table Container with Scroll */}
            <div className="overflow-auto max-h-[600px]">
              <table className="w-full text-xs sm:text-sm relative">
                <thead className="bg-slate-100 sticky top-0 z-20 shadow-sm">
                  <tr>
                    <th className="p-3 sm:p-4 text-left font-semibold text-slate-700 sticky left-0 bg-slate-100 z-30 min-w-[200px] sm:min-w-[300px]">
                      Descripción
                    </th>
                    <th className="p-3 sm:p-4 text-left font-semibold text-slate-700 min-w-[100px]">
                      Estado
                    </th>
                    {MONTHS.map(month => (
                      <th key={month} className="p-3 sm:p-4 text-right font-semibold text-slate-700 min-w-[70px] sm:min-w-[90px]">
                        {month}
                      </th>
                    ))}
                    <th className="p-3 sm:p-4 text-right font-semibold text-slate-700 min-w-[90px] sm:min-w-[110px]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {budgetData.map((category, catIndex) => {
                    const categoryColor = getCategoryColor(category.title);
                    return (
                      <React.Fragment key={category.id}>
                        {/* Category Header - Editable Title */}
                        <tr className="bg-slate-50">
                          <td
                            colSpan={15}
                            className="p-3 sm:p-4 font-bold text-slate-800 text-xs sm:text-sm sticky left-0 z-10"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-1 h-6 rounded-full"
                                style={{ backgroundColor: categoryColor.primary }}
                              />
                              <input
                                type="text"
                                disabled={!isEditing}
                                value={category.title}
                                onChange={(e) => handleCategoryTitleChange(catIndex, e.target.value)}
                                className={`flex-1 bg-transparent border-0 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white rounded px-2 py-1 ${isEditing ? 'hover:bg-white' : ''}`}
                                placeholder="Título de categoría"
                              />
                            </div>
                          </td>
                        </tr>
                        {/* Category Items */}
                        {category.items.map((item, itemIndex) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50 transition-colors duration-150"
                          >
                            {/* Editable Description */}
                            <td className="p-0 sticky left-0 bg-white hover:bg-slate-50 z-10">
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  disabled={!isEditing}
                                  value={item.description}
                                  onChange={(e) => handleDescriptionChange(catIndex, itemIndex, e.target.value)}
                                  className={`flex-1 text-slate-700 text-xs sm:text-sm p-3 sm:p-4 focus:outline-none rounded transition-colors ${isEditing
                                    ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-400'
                                    : 'bg-transparent border-none appearance-none'
                                    }`}
                                  placeholder="Descripción del ítem"
                                />
                                {/* Delete Button */}
                                {isEditing && (
                                  <button
                                    onClick={() => handleDeleteItem(catIndex, item.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors mr-2"
                                    title="Eliminar ítem"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Status Column */}
                            <td className="p-2 sm:p-3">
                              {isEditing ? (
                                <select
                                  value={item.status}
                                  onChange={(e) => handleStatusChange(catIndex, itemIndex, e.target.value as any)}
                                  className="w-full text-xs sm:text-sm border border-slate-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                >
                                  <option value="pending">Pendiente</option>
                                  <option value="in-progress">En Curso</option>
                                  <option value="completed">Ejecutado</option>
                                </select>
                              ) : (
                                getStatusBadge(item.status)
                              )}
                            </td>

                            {/* Monthly Costs */}
                            {item.monthlyCosts.map((cost, monthIndex) => (
                              <td
                                key={monthIndex}
                                className="p-2 sm:p-3 text-right text-slate-600 tabular-nums text-xs sm:text-sm"
                              >
                                <input
                                  type="number"
                                  min="0"
                                  max="999999"
                                  step="0.01"
                                  disabled={!isEditing}
                                  value={cost || ''}
                                  onChange={(e) => handleCostChange(catIndex, itemIndex, monthIndex, e.target.value)}
                                  className={`w-full text-right tabular-nums focus:outline-none rounded px-2 py-1 transition-all ${isEditing
                                    ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-400'
                                    : 'bg-transparent border-none appearance-none'
                                    }`}
                                  placeholder={isEditing ? "0" : ""}
                                />
                              </td>
                            ))}
                            {/* Item Total */}
                            <td className="p-3 sm:p-4 text-right font-semibold text-slate-900 tabular-nums text-xs sm:text-sm bg-slate-50">
                              ${formatCurrency(item.total)}
                            </td>
                          </tr>
                        ))}
                        {/* Add Item Button Row */}

                        {/* Add Item Button Row */}
                        {isEditing && (
                          <tr className="no-print bg-slate-50/50 hover:bg-slate-100 transition-colors">
                            <td colSpan={15} className="p-2 sticky left-0 z-10">
                              <button
                                onClick={() => handleAddItem(catIndex)}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                Agregar Ítem
                              </button>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gradient-to-r from-slate-100 to-slate-50 sticky bottom-0 z-20 shadow-lg">
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-slate-900 sticky left-0 bg-gradient-to-r from-slate-100 to-slate-50 z-30 text-xs sm:text-sm">
                      TOTAL MENSUAL
                    </td>
                    {monthlyTotals.map((total, i) => (
                      <td
                        key={i}
                        className="p-3 sm:p-4 text-right font-bold text-slate-900 tabular-nums text-xs sm:text-sm"
                      >
                        {total > 0 ? `$${formatCurrency(total)}` : '—'}
                      </td>
                    ))}
                    <td className="p-3 sm:p-4 text-right font-extrabold text-blue-700 text-base sm:text-lg tabular-nums">
                      ${formatCurrency(grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <section className="text-center py-8 px-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              Dashboard Interactivo
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Todos los cambios se guardan automáticamente en tu navegador. Los gráficos y tarjetas KPI se actualizan en tiempo real al editar los valores.
          </p>
        </section>
      </div>

      {/* PRINT VIEW - Professional Report */}
      <div className="print-only">
        <PrintReport
          budgetData={budgetData}
          grandTotal={grandTotal}
          monthlyTotals={monthlyTotals}
        />
      </div>
    </main>
  );
}
