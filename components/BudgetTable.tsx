'use client';

import React, { useTransition } from 'react';
import { Trash2, Plus, Edit3, Save, RotateCcw } from 'lucide-react';
import { getCategoryColor } from '@/app/colors';
import { formatCurrency } from '@/app/utils/budgetCalculations';
import {
    updateItemStatus,
    updateItemCost,
    updateItemDescription,
    updateCategoryTitle,
    addItemToCategory,
    deleteItem,
} from '@/app/actions';
import ExportButton from './ExportButton';

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// Type for the transformed budget data (with numbers instead of Decimals)
interface BudgetItem {
    id: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    monthlyCosts: number[];
    total: number;
}

interface BudgetCategory {
    id: string;
    title: string;
    total: number;
    percentage: string;
    items: BudgetItem[];
}

interface BudgetTableProps {
    initialData: BudgetCategory[];
    grandTotal: number;
    monthlyTotals: number[];
}

export default function BudgetTable({
    initialData,
    grandTotal,
    monthlyTotals,
}: BudgetTableProps) {
    const [isPending, startTransition] = useTransition();
    const [isEditing, setIsEditing] = React.useState(false);

    const handleStatusChange = (itemId: string, newStatus: string) => {
        startTransition(async () => {
            const result = await updateItemStatus(itemId, newStatus);
            if (!result.success) {
                console.error('Failed to update status:', result.error);
                alert('Error al actualizar el estado. Por favor, intenta de nuevo.');
            }
        });
    };

    const handleCostChange = (itemId: string, monthIndex: number, newValue: string) => {
        const numValue = parseFloat(newValue);
        if (isNaN(numValue)) return;

        startTransition(async () => {
            const result = await updateItemCost(itemId, monthIndex, numValue);
            if (!result.success) {
                console.error('Failed to update cost:', result.error);
                alert('Error al actualizar el costo. Por favor, intenta de nuevo.');
            }
        });
    };

    const handleDescriptionChange = (itemId: string, newDescription: string) => {
        startTransition(async () => {
            const result = await updateItemDescription(itemId, newDescription);
            if (!result.success) {
                console.error('Failed to update description:', result.error);
                alert('Error al actualizar la descripción. Por favor, intenta de nuevo.');
            }
        });
    };

    const handleCategoryTitleChange = (categoryId: string, newTitle: string) => {
        startTransition(async () => {
            const result = await updateCategoryTitle(categoryId, newTitle);
            if (!result.success) {
                console.error('Failed to update category title:', result.error);
                alert('Error al actualizar el título. Por favor, intenta de nuevo.');
            }
        });
    };

    const handleAddItem = (categoryId: string) => {
        startTransition(async () => {
            const result = await addItemToCategory(categoryId);
            if (!result.success) {
                console.error('Failed to add item:', result.error);
                alert('Error al agregar el ítem. Por favor, intenta de nuevo.');
            }
        });
    };

    const handleDeleteItem = (itemId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este ítem?')) return;

        startTransition(async () => {
            const result = await deleteItem(itemId);
            if (!result.success) {
                console.error('Failed to delete item:', result.error);
                alert('Error al eliminar el ítem. Por favor, intenta de nuevo.');
            }
        });
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
        <section className="mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
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
                        {/* Edit Toggle */}
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            disabled={isPending}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isEditing
                                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                            {initialData.map((category) => {
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
                                                        defaultValue={category.title}
                                                        onBlur={(e) => {
                                                            if (e.target.value !== category.title) {
                                                                handleCategoryTitleChange(category.id, e.target.value);
                                                            }
                                                        }}
                                                        className={`flex-1 bg-transparent border-0 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white rounded px-2 py-1 ${isEditing ? 'hover:bg-white' : ''
                                                            }`}
                                                        placeholder="Título de categoría"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Category Items */}
                                        {category.items.map((item) => (
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
                                                            defaultValue={item.description}
                                                            onBlur={(e) => {
                                                                if (e.target.value !== item.description) {
                                                                    handleDescriptionChange(item.id, e.target.value);
                                                                }
                                                            }}
                                                            className={`flex-1 text-slate-700 text-xs sm:text-sm p-3 sm:p-4 focus:outline-none rounded transition-colors ${isEditing
                                                                ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-400'
                                                                : 'bg-transparent border-none appearance-none'
                                                                }`}
                                                            placeholder="Descripción del ítem"
                                                        />
                                                        {/* Delete Button */}
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleDeleteItem(item.id)}
                                                                disabled={isPending}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors mr-2 disabled:opacity-50"
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
                                                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                            disabled={isPending}
                                                            className="w-full text-xs sm:text-sm border border-slate-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50"
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
                                                            defaultValue={Number(cost) || ''}
                                                            onBlur={(e) => {
                                                                const newValue = e.target.value;
                                                                if (newValue !== String(Number(cost))) {
                                                                    handleCostChange(item.id, monthIndex, newValue);
                                                                }
                                                            }}
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
                                                    ${formatCurrency(Number(item.total))}
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Add Item Button Row */}
                                        {isEditing && (
                                            <tr className="no-print bg-slate-50/50 hover:bg-slate-100 transition-colors">
                                                <td colSpan={15} className="p-2 sticky left-0 z-10">
                                                    <button
                                                        onClick={() => handleAddItem(category.id)}
                                                        disabled={isPending}
                                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
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
                                <td className="p-3 sm:p-4 font-bold text-slate-900 sticky left-0 bg-gradient-to-r from-slate-100 to-slate-50 z-30 text-xs sm:text-sm" colSpan={2}>
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
    );
}
