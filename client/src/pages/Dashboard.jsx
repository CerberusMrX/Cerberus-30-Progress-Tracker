import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useChallenge } from '../context/ChallengeContext';
import { FaFire, FaTimesCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import HeatmapGrid from '../components/HeatmapGrid';
import ProgressBar from '../components/ProgressBar';
import AIAssistant from '../components/AIAssistant';

export default function Dashboard() {
    const { activeChallenge, progress, loading } = useChallenge();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !activeChallenge) {
            navigate('/setup');
        }
    }, [loading, activeChallenge, navigate]);

    if (loading || !activeChallenge || !progress) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2 uppercase">
                        {activeChallenge.name}
                    </h1>
                    <p className="text-gray-400">MISSION DAY: <span className="text-white font-bold">{Math.floor((new Date() - new Date(activeChallenge.startDate)) / (1000 * 60 * 60 * 24)) + 1}</span> / {activeChallenge.duration}</p>
                </div>
                {activeChallenge.failResetEnabled && (
                    <div className="text-danger flex items-center gap-2 font-black mt-4 md:mt-0 animate-pulse">
                        <FaExclamationTriangle /> FAIL = RESET MODE ACTIVE
                    </div>
                )}
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <StatsCard title="Current Streak" value={progress.currentStreak} unit="Days" icon={<FaFire className="text-orange-500" />} />
                <StatsCard title="Longest Streak" value={progress.longestStreak} unit="Days" icon={<FaFire className="text-yellow-500" />} />
                <StatsCard title="Completion" value={`${progress.completionPct.toFixed(1)}%`} icon={<FaCheckCircle className="text-primary" />} />
                <StatsCard title="Violations" value={progress.missedDays} unit="Missed" icon={<FaTimesCircle className="text-danger" />} />
            </div>

            <div className="mb-10">
                <h2 className="text-xl font-bold mb-4">Progression Timeline</h2>
                <ProgressBar pct={progress.completionPct} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-6">
                    <h2 className="text-xl font-bold mb-6">30-Day Matrix</h2>
                    <HeatmapGrid />
                </div>
                <div className="glass-card p-6 flex flex-col">
                    <h2 className="text-xl font-bold mb-6">Oracle AI</h2>
                    <AIAssistant />
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, unit, icon }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-4 flex flex-col justify-between h-32 relative overflow-hidden"
        >
            <div className="text-sm text-gray-400 font-semibold uppercase">{title}</div>
            <div className="flex items-end gap-2 mt-4">
                <div className="text-4xl font-black">{value}</div>
                {unit && <div className="text-sm text-gray-500 mb-1">{unit}</div>}
            </div>
            <div className="absolute top-4 right-4 text-2xl opacity-50">{icon}</div>
        </motion.div>
    );
}
