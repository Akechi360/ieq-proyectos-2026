'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BudgetCategory } from '@/app/data';
import { getCategoryColor } from '@/app/colors';

interface BudgetDistributionChartProps {
    budgetData: BudgetCategory[];
}

export default function BudgetDistributionChart({ budgetData }: BudgetDistributionChartProps) {
    // Preparar datos para el gráfico
    const chartData = budgetData.map(category => ({
        name: category.title,
        value: category.total,
        percentage: category.percentage,
        color: getCategoryColor(category.title).primary,
    }));

    // Custom tooltip High-End (Dark theme)
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-slate-900/90 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-slate-700/50">
                    <p className="font-semibold text-white text-sm mb-2">
                        {data.name}
                    </p>
                    <p className="text-2xl font-bold text-white tabular-nums">
                        ${data.value.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                        <p className="text-xs text-slate-300">
                            {data.percentage} del total
                        </p>
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
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                Distribución del Presupuesto
            </h3>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {/* Definición de Gradientes y Sombras */}
                        <defs>
                            {chartData.map((entry, index) => (
                                <linearGradient id={`gradient-${index}`} key={index} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                                    <stop offset="100%" stopColor={entry.color} stopOpacity={1} />
                                </linearGradient>
                            ))}
                            <filter id="shadow" height="200%">
                                <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.2" />
                            </filter>
                        </defs>

                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={140}
                            innerRadius={90}
                            paddingAngle={5}
                            cornerRadius={5}
                            dataKey="value"
                            stroke="none"
                            animationBegin={200}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={`url(#gradient-${index})`}
                                    filter="url(#shadow)"
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => {
                                // Acortar nombres para la leyenda
                                if (value.includes('INFRAESTRUCTURA')) return 'Infraestructura';
                                if (value.includes('SOFTWARE')) return 'Software';
                                if (value.includes('TELEFONÍA')) return 'Telefonía';
                                if (value.includes('CÁMARAS')) return 'Cámaras';
                                if (value.includes('HERRAMIENTAS')) return 'Herramientas';
                                return value;
                            }}
                            wrapperStyle={{
                                paddingTop: '20px',
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#64748b'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
