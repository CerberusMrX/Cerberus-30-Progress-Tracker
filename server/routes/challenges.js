import express from 'express';
import { readDB, writeDB, generateId } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = await readDB();
        const challenges = db.challenges.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const db = await readDB();
        const { name, description, duration, disciplineMode, failResetEnabled, difficulty, defaultTasks, startDate } = req.body;

        const newChallenge = {
            _id: generateId(),
            name, description, duration: duration || 30, disciplineMode, failResetEnabled, difficulty, defaultTasks,
            startDate: startDate || new Date(),
            createdAt: new Date()
        };
        db.challenges.push(newChallenge);

        // Seed days
        let currentDate = new Date(newChallenge.startDate);
        for (let i = 1; i <= newChallenge.duration; i++) {
            db.days.push({
                _id: generateId(),
                challengeId: newChallenge._id,
                dayNumber: i,
                date: new Date(currentDate),
                status: 'pending',
                tasks: defaultTasks.map((t, idx) => ({ id: `task_${idx}`, text: t, done: false })),
                proofFiles: [],
                notes: ''
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        await writeDB(db);
        res.status(201).json(newChallenge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const db = await readDB();
        const challenge = db.challenges.find(c => c._id === req.params.id);
        if (!challenge) return res.status(404).json({ message: 'Not found' });
        res.json(challenge);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const db = await readDB();
        let index = db.challenges.findIndex(c => c._id === req.params.id);
        if (index > -1) {
            db.challenges[index] = { ...db.challenges[index], ...req.body };
            await writeDB(db);
            res.json(db.challenges[index]);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const db = await readDB();
        db.challenges = db.challenges.filter(c => c._id !== req.params.id);
        db.days = db.days.filter(d => d.challengeId !== req.params.id);
        await writeDB(db);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
