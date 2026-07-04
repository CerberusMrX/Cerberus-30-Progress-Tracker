import mongoose from 'mongoose';

const daySchema = new mongoose.Schema({
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    dayNumber: { type: Number, required: true }, // 1 to 30
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed', 'missed', 'partial'], default: 'pending' },
    tasks: [{
        id: { type: String, required: true },
        text: { type: String, required: true },
        done: { type: Boolean, default: false }
    }],
    proofFiles: [{
        filename: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    notes: { type: String }
});

export default mongoose.model('Day', daySchema);
