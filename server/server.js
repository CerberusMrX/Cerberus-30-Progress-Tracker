import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import challengesRoutes from './routes/challenges.js';
import daysRoutes from './routes/days.js';
import progressRoutes from './routes/progress.js';
import oracleRoutes from './routes/oracle.js';

app.use('/api/challenges', challengesRoutes);
app.use('/api/challenges/:challengeId/days', daysRoutes);
app.use('/api/challenges/:challengeId/progress', progressRoutes);
app.use('/api/oracle', oracleRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Cerberus Tracker API is online.' });
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Local JSON DB initialized');
});
