'use client';

import React from 'react';
import Image from 'next/image';
import { BudgetCategory } from '@/app/data';
import { formatCurrency } from '@/app/utils/budgetCalculations';
import { getCategoryColor } from '@/app/colors';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PrintReportProps {
    budgetData: BudgetCategory[];
    grandTotal: number;
    monthlyTotals: number[];
}

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MONTHS_SHORT = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function PrintReport({ budgetData, grandTotal, monthlyTotals }: PrintReportProps) {
    const [currentDate, setCurrentDate] = React.useState('');

    React.useEffect(() => {
        setCurrentDate(new Date().toLocaleString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }));
    }, []);

    return (
        <div className="bg-white text-black font-sans p-8 max-w-[297mm] mx-auto">
            {/* HEADER */}
            <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
                <div>
                    <Image
                        src="/ieq-logo.png"
                        alt="Clínica IEQ Los Mangos"
                        width={120}
                        height={60}
                        className="mb-2"
                    />
                    <h1 className="text-2xl font-bold text-black mb-1">
                        PLAN ESTRATÉGICO DE SISTEMAS 2026
                    </h1>
                    <p className="text-sm text-gray-700">
                        Documento de Presupuesto Aprobado
                    </p>
                </div>
                <div className="text-right text-sm">
                    <p className="font-semibold">Clínica IEQ Los Mangos</p>
                    <p className="text-gray-600">Fecha de generación:</p>
                    <p className="text-gray-900">{currentDate}</p>
                </div>
            </div>

            {/* EXECUTIVE SUMMARY */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
                    RESUMEN EJECUTIVO
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="border border-gray-300 p-3">
                        <p className="text-sm text-gray-600 mb-1">Presupuesto Total Anual</p>
                        <p className="text-2xl font-bold">${formatCurrency(grandTotal)}</p>
                    </div>
                    <div className="border border-gray-300 p-3">
                        <p className="text-sm text-gray-600 mb-1">Número de Categorías</p>
                        <p className="text-2xl font-bold">{budgetData.length}</p>
                    </div>
                </div>

                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2 text-left font-semibold">Categoría</th>
                            <th className="border border-gray-300 p-2 text-right font-semibold">Total Anual</th>
                            <th className="border border-gray-300 p-2 text-right font-semibold">% del Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgetData.map((category, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-300 p-2">{category.title}</td>
                                <td className="border border-gray-300 p-2 text-right font-mono">
                                    ${formatCurrency(category.total)}
                                </td>
                                <td className="border border-gray-300 p-2 text-right">
                                    {category.percentage}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-gray-300 font-bold">
                            <td className="border border-gray-300 p-2">TOTAL GENERAL</td>
                            <td className="border border-gray-300 p-2 text-right font-mono">
                                ${formatCurrency(grandTotal)}
                            </td>
                            <td className="border border-gray-300 p-2 text-right">100%</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* CHARTS SECTION */}
            <section className="mb-8 mt-8">
                <h2 className="text-xl font-bold mb-6 border-b border-gray-300 pb-2">
                    ANÁLISIS VISUAL
                </h2>

                <div className="grid grid-cols-2 gap-6">
                    {/* PIE CHART - Budget Distribution */}
                    <div className="break-inside-avoid">
                        <h3 className="text-base font-semibold mb-4">Distribución del Presupuesto</h3>
                        <div style={{ width: '100%', height: '350px' }}>
                            <PieChart width={450} height={350}>
                                <Pie
                                    data={budgetData.map(cat => ({
                                        name: cat.title.replace('INFRAESTRUCTURA Y', 'Infr.').replace('SOFTWARE Y', 'Soft.').replace('TELEFONÍA', 'Tel.').replace('CÁMARAS', 'Cám.').replace('HERRAMIENTAS', 'Herr.'),
                                        value: cat.total,
                                        percentage: cat.percentage
                                    }))}
                                    cx={225}
                                    cy={145}
                                    labelLine={false}
                                    label={({ percent }) => percent ? `${(percent * 100).toFixed(0)}%` : ''}
                                    outerRadius={100}
                                    innerRadius={60}
                                    dataKey="value"
                                    isAnimationActive={false}
                                >
                                    {budgetData.map((category, index) => (
                                        <Cell key={`cell-${index}`} fill={getCategoryColor(category.title).primary} />
                                    ))}
                                </Pie>
                                <Legend
                                    iconSize={12}
                                    wrapperStyle={{ fontSize: '11px' }}
                                />
                            </PieChart>
                        </div>
                    </div>

                    {/* BAR CHART - Monthly Cash Flow */}
                    <div className="break-inside-avoid">
                        <h3 className="text-base font-semibold mb-4">Flujo de Caja Mensual</h3>
                        <div style={{ width: '100%', height: '350px' }}>
                            <BarChart
                                width={450}
                                height={350}
                                data={monthlyTotals.map((total, idx) => ({
                                    month: MONTHS_SHORT[idx],
                                    amount: total
                                }))}
                                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11 }}
                                    stroke="#6b7280"
                                />
                                <YAxis
                                    tick={{ fontSize: 10 }}
                                    stroke="#6b7280"
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{ fontSize: '12px' }}
                                    formatter={(value: number) => [`$${formatCurrency(value)}`, 'Monto']}
                                />
                                <Bar
                                    dataKey="amount"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    isAnimationActive={false}
                                />
                            </BarChart>
                        </div>
                    </div>
                </div>
            </section>

            {/* MONTHLY BREAKDOWN */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
                    DESGLOSE MENSUAL DETALLADO
                </h2>

                {budgetData.map((category, catIdx) => (
                    <div key={catIdx} className="mb-6 break-inside-avoid">
                        <h3 className="text-lg font-bold bg-gray-200 p-2 mb-2">
                            {category.title}
                        </h3>
                        <table className="budget-table w-full border-collapse border border-gray-300 text-xs mb-4">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-1 text-left font-semibold w-32">
                                        Descripción
                                    </th>
                                    {MONTHS.map((month, idx) => (
                                        <th key={idx} className="border border-gray-300 p-1 text-right font-semibold text-[9px]">
                                            {month.slice(0, 3)}
                                        </th>
                                    ))}
                                    <th className="border border-gray-300 p-1 text-right font-semibold">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.items.map((item, itemIdx) => (
                                    <tr key={itemIdx} className={itemIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="border border-gray-300 p-1 text-xs">
                                            {item.description}
                                        </td>
                                        {item.monthlyCosts.map((cost, monthIdx) => (
                                            <td key={monthIdx} className="border border-gray-300 p-1 text-right font-mono text-[8px]">
                                                {cost > 0 ? `$${formatCurrency(cost)}` : '—'}
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 p-1 text-right font-mono font-semibold text-xs">
                                            ${formatCurrency(item.total)}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-200 font-bold">
                                    <td className="border border-gray-300 p-1 text-xs">
                                        Subtotal {category.title}
                                    </td>
                                    {category.items[0]?.monthlyCosts.map((_, monthIdx) => {
                                        const monthTotal = category.items.reduce((sum, item) => sum + item.monthlyCosts[monthIdx], 0);
                                        return (
                                            <td key={monthIdx} className="border border-gray-300 p-1 text-right font-mono text-[8px]">
                                                {monthTotal > 0 ? `$${formatCurrency(monthTotal)}` : '—'}
                                            </td>
                                        );
                                    })}
                                    <td className="border border-gray-300 p-1 text-right font-mono text-xs">
                                        ${formatCurrency(category.total)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}

                {/* GRAND TOTAL */}
                <div className="border-t-4 border-black pt-4">
                    <table className="grand-total-table w-full border-collapse border-2 border-black text-sm">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="border-2 border-black p-2 text-left font-bold">
                                    TOTALES MENSUALES
                                </th>
                                {MONTHS.map((month, idx) => (
                                    <th key={idx} className="border-2 border-black p-2 text-right font-bold text-xs">
                                        {month.slice(0, 3)}
                                    </th>
                                ))}
                                <th className="border-2 border-black p-2 text-right font-bold">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-yellow-50">
                                <td className="border-2 border-black p-2 font-bold">
                                    GRAN TOTAL
                                </td>
                                {monthlyTotals.map((total, idx) => (
                                    <td key={idx} className="border-2 border-black p-2 text-right font-mono font-bold text-xs">
                                        ${formatCurrency(total)}
                                    </td>
                                ))}
                                <td className="border-2 border-black p-2 text-right font-mono font-bold text-lg">
                                    ${formatCurrency(grandTotal)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
