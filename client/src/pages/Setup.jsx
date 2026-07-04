import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useChallenge } from '../context/ChallengeContext';
import { FaPlus, FaTrash, FaChevronLeft } from 'react-icons/fa';

export default function Setup() {
    const navigate = useNavigate();
    const { setActiveChallenge, refreshChallengeData } = useChallenge();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        difficulty: 'medium',
        disciplineMode: false,
        failResetEnabled: false,
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    });
    const [tasks, setTasks] = useState(['Drink 1 gallon of water', 'Workout 45 mins', 'Read 10 pages']);
    const [newTask, setNewTask] = useState('');

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.createChallenge({ ...formData, defaultTasks: tasks });
            setActiveChallenge(res.data);
            await refreshChallengeData(res.data._id);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to create challenge');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-[url('/bg-matrix.png')] bg-cover bg-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card max-w-2xl w-full p-8"
            >
                <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-400 hover:text-white mb-6 transition">
                    <FaChevronLeft className="mr-2" /> Back to Dashboard
                </button>
                <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">CERBERUS 30</h1>
                <p className="text-muted-foreground mb-8">Deploy a new 30-day discipline protocol.</p>

                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Protocol Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-primary"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Start Date</label>
                            <input
                                required
                                type="date"
                                className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-primary"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center justify-between">
                            Daily Tasks
                            <span className="text-xs font-normal text-gray-400">These repeat every day</span>
                        </label>
                        <div className="space-y-2 mb-4">
                            {tasks.map((t, i) => (
                                <div key={i} className="flex justify-between items-center bg-black/50 p-3 rounded border border-white/10">
                                    <span>{t}</span>
                                    <button type="button" onClick={() => setTasks(tasks.filter((_, idx) => idx !== i))} className="text-danger hover:text-red-400">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-black/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-primary"
                                placeholder="Add a new task..."
                                value={newTask}
                                onChange={e => setNewTask(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (newTask.trim()) { setTasks([...tasks, newTask]); setNewTask(''); }
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => { if (newTask.trim()) { setTasks([...tasks, newTask]); setNewTask(''); } }}
                                className="bg-accent hover:bg-purple-600 text-white p-3 rounded transition"
                            >
                                <FaPlus />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="accent-primary w-5 h-5"
                                checked={formData.disciplineMode}
                                onChange={e => setFormData({ ...formData, disciplineMode: e.target.checked })}
                            />
                            <div>
                                <div className="font-semibold text-warning">Discipline Mode</div>
                                <div className="text-xs text-gray-400">Lock past days from editing</div>
                            </div>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="accent-danger w-5 h-5"
                                checked={formData.failResetEnabled}
                                onChange={e => setFormData({ ...formData, failResetEnabled: e.target.checked })}
                            />
                            <div>
                                <div className="font-semibold text-danger">Fail = Reset (Hardcore)</div>
                                <div className="text-xs text-gray-400">Missing a day restarts protocol</div>
                            </div>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-green-500 text-black font-black text-lg py-4 rounded transition shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                    >
                        INITIALIZE PROTOCOL
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
