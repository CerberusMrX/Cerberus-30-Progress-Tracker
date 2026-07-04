import express from 'express';
import { readDB, writeDB } from '../db.js';
import multer from 'multer';
import path from 'path';

const router = express.Router({ mergeParams: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const db = await readDB();
        const days = db.days.filter(d => d.challengeId === req.params.challengeId)
            .sort((a, b) => a.dayNumber - b.dayNumber);
        res.json(days);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:dayNumber', async (req, res) => {
    try {
        const db = await readDB();
        const day = db.days.find(d => d.challengeId === req.params.challengeId && d.dayNumber == req.params.dayNumber);
        if (!day) return res.status(404).json({ message: 'Day not found' });
        res.json(day);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:dayNumber', async (req, res) => {
    try {
        const db = await readDB();
        let index = db.days.findIndex(d => d.challengeId === req.params.challengeId && d.dayNumber == req.params.dayNumber);
        if (index > -1) {
            db.days[index] = { ...db.days[index], ...req.body };
            await writeDB(db);
            res.json(db.days[index]);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/:dayNumber/proof', upload.array('proofFiles', 5), async (req, res) => {
    try {
        const db = await readDB();
        let index = db.days.findIndex(d => d.challengeId === req.params.challengeId && d.dayNumber == req.params.dayNumber);
        if (index > -1) {
            const newFiles = req.files.map(file => ({
                filename: file.originalname,
                url: `/uploads/${file.filename}`
            }));
            if (!db.days[index].proofFiles) db.days[index].proofFiles = [];
            db.days[index].proofFiles.push(...newFiles);
            await writeDB(db);
            res.json(db.days[index]);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
