'use client';

import { Server, Code, Phone, Camera, Wrench } from 'lucide-react';
import CountUp from 'react-countup';

// Icon mapping
const iconMap = {
    Server,
    Code,
    Phone,
    Camera,
    Wrench,
};

type IconName = keyof typeof iconMap;

interface KPICardProps {
    title: string;
    amount: number;
    percentage: string;
    iconName: IconName;
    color: {
        primary: string;
        light: string;
        medium: string;
        dark: string;
    };
    delay?: number;
}

export default function KPICard({
    title,
    amount,
    percentage,
    iconName,
    color,
    delay = 0
}: KPICardProps) {
    const percentageNum = parseInt(percentage.replace('%', ''));
    const Icon = iconMap[iconName];

    return (
        <div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-100 border-t-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            style={{
                animationDelay: `${delay}ms`,
                borderTopColor: color.primary
            }}
        >
            {/* Icon and Title */}
            <div className="flex items-start justify-between mb-4">
                <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: color.light }}
                >
                    <Icon
                        className="w-8 h-8"
                        style={{ color: color.primary }}
                    />
                </div>
            </div>

            {/* Category Title */}
            <h3 className="text-sm font-medium text-slate-600 mb-2 line-clamp-2 min-h-[2.5rem]">
                {title}
            </h3>

            {/* Amount with CountUp Animation */}
            <div className="mb-4">
                <span className="text-3xl font-bold text-slate-900 tabular-nums">
                    $<CountUp
                        key={amount}
                        end={amount}
                        duration={2}
                        separator=","
                        delay={delay / 1000}
                    />
                </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Del total</span>
                    <span className="font-semibold text-slate-700">{percentage}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${percentageNum}%`,
                            backgroundColor: color.primary,
                            transitionDelay: `${delay + 500}ms`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
