'use client';
import { motion } from 'framer-motion';

export default function AnimatedNumber() {
    return (
        <span className="inline-grid relative overflow-hidden align-baseline">
            {/* Elemento fantasma para forzar dimensiones y línea base exactas */}
            <span className="opacity-0 col-start-1 row-start-1 pointer-events-none">6</span>

            {/* Elemento animado superpuesto */}
            <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
                className="col-start-1 row-start-1 bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent select-none"
            >
                6
            </motion.span>
        </span>
    );
}
