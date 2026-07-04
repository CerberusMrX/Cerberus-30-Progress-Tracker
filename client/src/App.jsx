import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import DayDetail from './pages/DayDetail';
import { ChallengeProvider } from './context/ChallengeContext';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <ChallengeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-white selection:bg-accent/30 selection:text-white">
          <Routes>
            <Route path="/setup" element={<Setup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/day/:dayNumber" element={<DayDetail />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </ChallengeProvider>
  );
}

export default App;
