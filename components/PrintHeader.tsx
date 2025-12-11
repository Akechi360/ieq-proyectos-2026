'use client';

import React from 'react';

export default function PrintHeader() {
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
        <div className="hidden print-only print-header">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Plan Estratégico de Sistemas 2026
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Documento de Presupuesto Aprobado
                    </p>
                </div>
                <div className="text-right text-sm text-gray-600">
                    <p className="font-semibold">Clínica IEQ Los Mangos</p>
                    <p>Fecha de generación: {currentDate}</p>
                </div>
            </div>
        </div>
    );
}
