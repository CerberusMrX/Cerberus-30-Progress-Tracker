import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Challenges
export const fetchChallenges = () => api.get('/challenges');
export const fetchChallenge = (id) => api.get(`/challenges/${id}`);
export const createChallenge = (data) => api.post('/challenges', data);
export const updateChallenge = (id, data) => api.patch(`/challenges/${id}`, data);
export const deleteChallenge = (id) => api.delete(`/challenges/${id}`);

// Days
export const fetchDays = (challengeId) => api.get(`/challenges/${challengeId}/days`);
export const fetchDay = (challengeId, dayNumber) => api.get(`/challenges/${challengeId}/days/${dayNumber}`);
export const updateDay = (challengeId, dayNumber, data) => api.patch(`/challenges/${challengeId}/days/${dayNumber}`, data);
export const uploadProof = (challengeId, dayNumber, formData) => api.post(`/challenges/${challengeId}/days/${dayNumber}/proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Progress
export const fetchProgress = (challengeId) => api.get(`/challenges/${challengeId}/progress`);

// Oracle
export const searchOracle = (query) => api.get(`/oracle/search?q=${encodeURIComponent(query)}`);

export default api;
