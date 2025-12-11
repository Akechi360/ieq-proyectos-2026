'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
    onExportStart?: () => void;
    onExportComplete?: () => void;
}

export default function ExportButton({ onExportStart, onExportComplete }: ExportButtonProps) {
    const handlePrint = () => {
        onExportStart?.();

        // Small delay to ensure any UI updates complete
        setTimeout(() => {
            window.print();
            onExportComplete?.();
        }, 100);
    };

    return (
        <button
            onClick={handlePrint}
            className="no-print flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition-colors focus:ring-2 focus:ring-slate-200 outline-none"
        >
            <Download className="w-4 h-4" />
            Exportar PDF
        </button>
    );
}
