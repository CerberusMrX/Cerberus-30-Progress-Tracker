import { motion } from 'framer-motion';

export default function ProgressBar({ pct }) {
    return (
        <div className="w-full bg-muted rounded-full h-4 overflow-hidden relative border border-white/10">
            <motion.div
                className="h-full bg-gradient-to-r from-accent to-primary"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-[url('/stripe-pattern.png')] opacity-20 mix-blend-overlay"></div>
        </div>
    );
}
