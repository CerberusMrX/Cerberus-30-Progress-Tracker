import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChallenge } from '../context/ChallengeContext';
import * as api from '../api';
import { FaSearch } from 'react-icons/fa';

const AI_QUOTES = [
    "Discipline equals freedom. Do the work.",
    "You cannot negotiate with weakness.",
    "Pain is temporary. Victory is forever.",
    "The only easy day was yesterday. Commit.",
    "Excuses are the language of failure.",
    "No days off. Advance the protocol."
];

export default function AIAssistant() {
    const { progress } = useChallenge();
    const [quote, setQuote] = useState(AI_QUOTES[0]);
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const hasSearched = useRef(false);

    useEffect(() => {
        let idx = 0;
        const interval = setInterval(() => {
            if (!hasSearched.current) {
                idx = (idx + 1) % AI_QUOTES.length;
                setQuote(AI_QUOTES[idx]);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        hasSearched.current = true;
        setIsSearching(true);
        setQuote("Querying Oracle Mainframe...");

        try {
            const res = await api.searchOracle(query);
            setQuote(res.data.result);
        } catch (error) {
            setQuote("ERROR: Oracle connection severed. Remain disciplined.");
        } finally {
            setIsSearching(false);
            setQuery('');
        }
    };

    return (
        <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-bold tracking-widest text-sm">ORACLE LINK ACTIVE</span>
            </div>

            <div className="bg-black/50 p-4 rounded border border-white/10 flex-1 relative overflow-hidden flex flex-col">
                <div className="flex-1 min-h-[100px] flex items-center mb-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={quote}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`text-sm md:text-base italic ${hasSearched.current ? 'text-primary' : 'text-gray-300'}`}
                        >
                            "{quote}"
                        </motion.div>
                    </AnimatePresence>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search Oracle Database..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="flex-1 bg-black/60 border border-white/20 rounded p-2 text-sm focus:outline-none focus:border-primary text-white"
                        disabled={isSearching}
                    />
                    <button type="submit" disabled={isSearching} className="bg-primary hover:bg-green-500 text-black p-2 rounded transition">
                        <FaSearch />
                    </button>
                </form>
            </div>

            {progress.missedDays > 0 && (
                <div className="mt-4 text-xs text-danger uppercase font-bold tracking-wider">
                    Warning: Protocol violations detected ({progress.missedDays}). Calibration required.
                </div>
            )}
        </div>
    );
}
