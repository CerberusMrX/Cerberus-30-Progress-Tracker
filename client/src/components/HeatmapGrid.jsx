import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useChallenge } from '../context/ChallengeContext';

export default function HeatmapGrid() {
    const { days } = useChallenge();
    const navigate = useNavigate();

    const getColorClass = (day, pct) => {
        if (day.status === 'pending') return 'bg-muted hover:bg-gray-600';
        if (pct < 40) return 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]';
        if (pct < 70) return 'bg-warning shadow-[0_0_10px_rgba(234,179,8,0.5)]';
        return 'bg-primary shadow-[0_0_10px_rgba(74,222,128,0.5)]';
    };

    return (
        <div className="grid grid-cols-5 md:grid-cols-6 gap-3">
            {days.map((day, i) => {
                const pct = day.tasks?.length ? Math.round((day.tasks.filter(t => t.done).length / day.tasks.length) * 100) : 0;
                return (
                    <motion.div
                        key={day._id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/day/${day.dayNumber}`)}
                        className={`aspect-square rounded flex flex-col items-center justify-center cursor-pointer font-bold text-lg select-none transition-colors border border-white/5 ${getColorClass(day, pct)}`}
                        title={`Day ${day.dayNumber} - ${day.status.toUpperCase()}`}
                    >
                        <div>{new Date(day.date).getDate()}</div>
                        <div className="text-[10px] sm:text-xs font-normal opacity-80 mt-1">
                            {pct}%
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
