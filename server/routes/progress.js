import express from 'express';
import { readDB } from '../db.js';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
    try {
        const db = await readDB();
        const challengeId = req.params.challengeId;
        const challenge = db.challenges.find(c => c._id === challengeId);
        if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

        const days = db.days.filter(d => d.challengeId === challengeId).sort((a, b) => a.dayNumber - b.dayNumber);

        let completedDays = 0;
        let missedDays = 0;
        let partialDays = 0;
        let currentStreak = 0;
        let longestStreak = 0;

        let tempStreak = 0;

        days.forEach(day => {
            if (day.status === 'completed') {
                completedDays++;
                tempStreak++;
                if (tempStreak > longestStreak) longestStreak = tempStreak;
            } else if (day.status === 'missed') {
                missedDays++;
                tempStreak = 0;
            } else if (day.status === 'partial') {
                partialDays++;
                tempStreak = 0;
            } else {
                tempStreak = 0;
            }
        });

        let activeStreak = 0;
        for (let i = days.length - 1; i >= 0; i--) {
            if (days[i].status === 'completed') activeStreak++;
            else if (days[i].status !== 'pending') break;
        }

        const completionPct = (completedDays / challenge.duration) * 100;

        res.json({
            completionPct,
            currentStreak: activeStreak,
            longestStreak,
            missedDays,
            partialDays,
            dayStatuses: days.map(d => d.status)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
