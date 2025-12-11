'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BudgetCategory } from '@/app/data';
import { getCategoryColor } from '@/app/colors';

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

interface MonthlyCashFlowChartProps {
    budgetData: BudgetCategory[];
}

export default function MonthlyCashFlowChart({ budgetData }: MonthlyCashFlowChartProps) {
    // 1. TRANSFORMACIÓN DE DATOS
    const formattedData = MONTHS.map((month, monthIndex) => {
        const dataPoint: any = { month };
        budgetData.forEach(category => {
            const monthlyTotal = category.items.reduce((sum, item) => sum + (item.monthlyCosts[monthIndex] || 0), 0);
            if (category.title.includes('INFRAESTRUCTURA')) dataPoint.infra = monthlyTotal;
            else if (category.title.includes('SOFTWARE')) dataPoint.software = monthlyTotal;
            else if (category.title.includes('TELEFONÍA')) dataPoint.telefonia = monthlyTotal;
            else if (category.title.includes('CÁMARAS')) dataPoint.camaras = monthlyTotal;
            else if (category.title.includes('HERRAMIENTAS')) dataPoint.herramientas = monthlyTotal;
        });
        return dataPoint;
    });

    // Colores base (coinciden con el PieChart a través de getCategoryColor o directos para control)
    const colors = {
        infra: '#3b82f6', // Azul
        software: '#10b981', // Emerald
        telefonia: '#f59e0b', // Amber
        camaras: '#8b5cf6', // Violeta
        herramientas: '#ec4899' // Rosa
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
            return (
                <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-700/50">
                    <p className="font-semibold text-white mb-2">{label}</p>
                    <div className="space-y-1">
                        {payload.reverse().map((entry: any, index: number) => (
                            entry.value > 0 && (
                                <div key={index} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ background: entry.fill }} />
                                        <span className="text-xs text-slate-300 uppercase">{entry.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-white tabular-nums">${entry.value.toLocaleString()}</span>
                                </div>
                            )
                        ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between">
                        <span className="text-xs text-slate-400 font-bold uppercase">Total</span>
                        <span className="text-base font-bold text-white tabular-nums">${total.toLocaleString()}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[350px] w-full bg-slate-50 rounded-2xl animate-pulse" />;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Flujo de Caja Mensual</h3>
            <p className="text-sm text-slate-500 mb-6">Detalle de gastos por categoría (Glossy Style)</p>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={formattedData}
                        margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                        barSize={32}
                    >
                        <defs>
                            {/* Infraestructura (Azul) */}
                            <linearGradient id="gradInfra" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colors.infra} stopOpacity={0.6} />
                                <stop offset="100%" stopColor={colors.infra} stopOpacity={1} />
                            </linearGradient>
                            {/* Software (Verde) */}
                            <linearGradient id="gradSoft" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colors.software} stopOpacity={0.6} />
                                <stop offset="100%" stopColor={colors.software} stopOpacity={1} />
                            </linearGradient>
                            {/* Telefonía (Naranja) */}
                            <linearGradient id="gradTele" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colors.telefonia} stopOpacity={0.6} />
                                <stop offset="100%" stopColor={colors.telefonia} stopOpacity={1} />
                            </linearGradient>
                            {/* Cámaras (Violeta) */}
                            <linearGradient id="gradCam" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colors.camaras} stopOpacity={0.6} />
                                <stop offset="100%" stopColor={colors.camaras} stopOpacity={1} />
                            </linearGradient>
                            {/* Herramientas (Rosa) */}
                            <linearGradient id="gradTool" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colors.herramientas} stopOpacity={0.6} />
                                <stop offset="100%" stopColor={colors.herramientas} stopOpacity={1} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.2)" />

                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                        />

                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)', radius: 4 }} />

                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ paddingBottom: '20px' }}
                            formatter={(value) => <span className="text-slate-600 font-medium text-xs ml-1">{value}</span>}
                        />

                        <Bar dataKey="infra" name="Infraestructura" stackId="a" fill="url(#gradInfra)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="software" name="Software" stackId="a" fill="url(#gradSoft)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="telefonia" name="Telefonía" stackId="a" fill="url(#gradTele)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="camaras" name="Cámaras" stackId="a" fill="url(#gradCam)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="herramientas" name="Herramientas" stackId="a" fill="url(#gradTool)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
