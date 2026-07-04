import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, default: Date.now },
    duration: { type: Number, default: 30 },
    disciplineMode: { type: Boolean, default: false },
    failResetEnabled: { type: Boolean, default: false },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'elite'], default: 'medium' },
    defaultTasks: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Challenge', challengeSchema);
