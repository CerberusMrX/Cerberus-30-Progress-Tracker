import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';

const ChallengeContext = createContext();

export const useChallenge = () => useContext(ChallengeContext);

export const ChallengeProvider = ({ children }) => {
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [days, setDays] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const res = await api.fetchChallenges();
            if (res.data.length > 0) {
                const challenge = res.data[0];
                setActiveChallenge(challenge);
                refreshChallengeData(challenge._id);
            }
        } catch (error) {
            console.error('Failed to load challenges', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshChallengeData = async (challengeId) => {
        try {
            const [daysRes, progressRes] = await Promise.all([
                api.fetchDays(challengeId),
                api.fetchProgress(challengeId)
            ]);
            setDays(daysRes.data);
            setProgress(progressRes.data);
        } catch (error) {
            console.error('Failed to load challenge data', error);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    return (
        <ChallengeContext.Provider value={{
            activeChallenge, setActiveChallenge,
            days, setDays,
            progress, setProgress,
            loading, loadInitialData,
            refreshChallengeData
        }}>
            {children}
        </ChallengeContext.Provider>
    );
};
