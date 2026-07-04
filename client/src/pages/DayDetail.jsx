import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaUpload, FaCheck, FaTimes, FaExclamationTriangle, FaEdit, FaTrash, FaPlus, FaSave } from 'react-icons/fa';
import * as api from '../api';
import { useChallenge } from '../context/ChallengeContext';

export default function DayDetail() {
    const { dayNumber } = useParams();
    const navigate = useNavigate();
    const { activeChallenge, refreshChallengeData } = useChallenge();

    const [day, setDay] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFailModal, setShowFailModal] = useState(false);
    const [isEditingTasks, setIsEditingTasks] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');

    useEffect(() => {
        if (!activeChallenge) {
            navigate('/dashboard');
            return;
        }
        loadDay();
    }, [dayNumber, activeChallenge]);

    const loadDay = async () => {
        try {
            const res = await api.fetchDay(activeChallenge._id, dayNumber);
            setDay(res.data);
            setTasks(res.data.tasks);
        } catch (e) {
            console.error(e);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const isLocked = false;

    const handleTaskToggle = async (idx) => {
        if (isLocked) return;
        const newTasks = [...tasks];
        newTasks[idx].done = !newTasks[idx].done;
        setTasks(newTasks);

        // Auto calculate status
        const allDone = newTasks.every(t => t.done);
        const someDone = newTasks.some(t => t.done);
        const status = allDone ? 'completed' : (someDone ? 'partial' : 'pending');

        await updateDayData({ tasks: newTasks, status });
    };

    const handleTaskTextChange = (idx, text) => {
        const newTasks = [...tasks];
        newTasks[idx].text = text;
        setTasks(newTasks);
    };

    const handleDeleteTask = (idx) => {
        const newTasks = tasks.filter((_, i) => i !== idx);
        setTasks(newTasks);
    };

    const handleAddTask = () => {
        if (!newTaskText.trim()) return;
        const newTasks = [...tasks, { id: Date.now().toString(), text: newTaskText, done: false }];
        setTasks(newTasks);
        setNewTaskText('');
    };

    const handleSaveTasks = async () => {
        setIsEditingTasks(false);
        // Recalculate status based on new tasks length and done state
        const allDone = tasks.length > 0 && tasks.every(t => t.done);
        const someDone = tasks.some(t => t.done);
        const status = allDone ? 'completed' : (someDone ? 'partial' : 'pending');
        await updateDayData({ tasks, status });
    };

    const handleMarkMissed = async () => {
        if (isLocked) return;
        await updateDayData({ status: 'missed' });
        if (activeChallenge.failResetEnabled) {
            setShowFailModal(true);
        }
    };

    const updateDayData = async (data) => {
        try {
            const res = await api.updateDay(activeChallenge._id, dayNumber, data);
            setDay(res.data);
            await refreshChallengeData(activeChallenge._id);
        } catch (err) {
            console.error(err);
        }
    };

    const executeFailReset = async () => {
        // Delete and recreate challenge to simulate Hard Reset
        await api.deleteChallenge(activeChallenge._id);
        navigate('/setup');
    };

    if (loading || !day) return <div className="p-8">Loading...</div>;

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl relative">
            <AnimatePresence>
                {showFailModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
                            className="bg-danger/10 border border-danger p-8 rounded-2xl max-w-md w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.3)]"
                        >
                            <FaExclamationTriangle className="text-danger text-6xl mx-auto mb-6" />
                            <h2 className="text-3xl font-black text-danger mb-2">PROTOCOL FAILED</h2>
                            <p className="text-white mb-8">You missed Day {dayNumber}. Hardcore mode is active. Your progress has been destroyed. You must start over.</p>
                            <button
                                onClick={executeFailReset}
                                className="w-full bg-danger hover:bg-red-600 text-white font-bold py-3 rounded uppercase tracking-wider"
                            >
                                Accept Defeat & Reset
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-400 hover:text-white mb-6 transition">
                <FaChevronLeft className="mr-2" /> Back to Dashboard
            </button>

            <header className="mb-8 flex justify-between tracking-wide">
                <div>
                    <h1 className="text-3xl font-black mb-1">DAY {day.dayNumber}</h1>
                    <div className="text-muted-foreground">{new Date(day.date).toDateString()}</div>
                </div>
                <div className={`px-4 py-2 rounded font-bold uppercase ${day.status === 'completed' ? 'bg-primary text-black' : day.status === 'missed' ? 'bg-danger text-black' : day.status === 'partial' ? 'bg-warning text-black' : 'bg-muted'}`}>
                    {day.status}
                </div>
            </header>

            {isLocked && (
                <div className="bg-warning/20 border border-warning text-warning p-4 rounded mb-6 flex items-center gap-3">
                    <FaExclamationTriangle /> Discipline Mode active. This day is locked and cannot be edited.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Daily Objectives</h2>
                        {!isLocked && (
                            <button
                                onClick={() => isEditingTasks ? handleSaveTasks() : setIsEditingTasks(true)}
                                className={`flex items-center gap-2 text-sm px-3 py-1 rounded transition ${isEditingTasks ? 'bg-primary text-black hover:bg-green-500' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                                {isEditingTasks ? <><FaSave /> Save</> : <><FaEdit /> Edit</>}
                            </button>
                        )}
                    </div>
                    <div className="space-y-3">
                        {tasks.map((task, idx) => (
                            <div
                                key={task.id}
                                className={`p-4 rounded border transition flex items-center justify-between ${isEditingTasks ? 'bg-black/80 border-white/20' : (task.done ? 'bg-primary/10 border-primary text-gray-300 cursor-pointer' : 'bg-black/50 border-white/10 hover:border-white/30 cursor-pointer')}`}
                                onClick={() => !isEditingTasks && handleTaskToggle(idx)}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    {!isEditingTasks && (
                                        <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center border transition ${task.done ? 'bg-primary border-primary text-black' : 'border-gray-500'}`}>
                                            {task.done && <FaCheck size={12} />}
                                        </div>
                                    )}
                                    {isEditingTasks ? (
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-b border-white/30 focus:border-primary outline-none py-1"
                                            value={task.text}
                                            onChange={e => handleTaskTextChange(idx, e.target.value)}
                                        />
                                    ) : (
                                        <span className={task.done ? 'line-through opacity-70' : ''}>{task.text}</span>
                                    )}
                                </div>
                                {isEditingTasks && (
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteTask(idx); }} className="text-danger hover:text-red-400 p-2 ml-2">
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                        {isEditingTasks && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                <input
                                    type="text"
                                    className="flex-1 bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-primary text-sm"
                                    placeholder="Add a new task..."
                                    value={newTaskText}
                                    onChange={e => setNewTaskText(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTask();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleAddTask}
                                    className="bg-accent hover:bg-purple-600 text-white p-2 text-sm rounded transition flex items-center"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        )}
                    </div>

                    {!isLocked && day.status !== 'completed' && (
                        <button
                            onClick={handleMarkMissed}
                            className="mt-8 w-full border border-danger text-danger hover:bg-danger/10 p-3 rounded font-bold transition flex items-center justify-center gap-2"
                        >
                            <FaTimes /> Mark Day as Missed
                        </button>
                    )}
                </div>

                <div className="glass-card p-6 flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Proof of Work</h2>
                    <div className="flex-1 bg-black/50 border border-dashed border-white/20 rounded flex flex-col items-center justify-center p-6 text-center hover:bg-white/5 transition cursor-pointer">
                        <FaUpload className="text-3xl text-gray-500 mb-4" />
                        <p className="text-gray-400 font-semibold">Drop files here or click to upload</p>
                        <p className="text-xs text-gray-600 mt-2">Images, screenshots, or documents</p>
                        {/* The upload logic would use multer via the API hook uploadProof, simplified for UI mockup level but will integrate standard file input if time permits */}
                        <input type="file" className="hidden" />
                    </div>

                    {day.proofFiles?.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h3 className="text-sm font-bold text-gray-400">UPLOADED PROOFS</h3>
                            {day.proofFiles.map((file, i) => (
                                <div key={i} className="text-sm bg-black/40 p-2 rounded flex justify-between">
                                    <span>{file.filename}</span>
                                    <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">View</a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
