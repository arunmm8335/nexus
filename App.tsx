
import React, { useState, useEffect } from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Sun, Moon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { FinancePage } from './pages/FinancePage';
import { JournalPage } from './pages/JournalPage';
import { WellnessPage } from './pages/WellnessPage';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isLightMode, setIsLightMode] = useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  const toggleTheme = () => setIsLightMode(!isLightMode);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/': return "Operations Dashboard";
      case '/finance': return "Financial Telemetry";
      case '/journal': return "Memory Bank";
      case '/wellness': return "Bio-Metrics & Wellness";
      default: return "System";
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent transition-colors duration-300" style={{ color: 'var(--text-main)' }}>
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-20 lg:ml-64 transition-all duration-300 overflow-x-hidden">
         {/* Global Header */}
         <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <LayoutDashboard className="w-8 h-8 text-sky-400" />
              <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                NEXUS
              </h1>
            </div>
            <p className="text-sm tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>{getPageTitle(location.pathname)}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
              style={{ color: 'var(--text-muted)' }}
              title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {isLightMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>

            <div className="text-right hidden md:block">
              <div className="text-5xl font-extralight tracking-tight" style={{ color: 'var(--text-main)' }}>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center justify-end mt-1 space-x-2" style={{ color: 'var(--text-muted)' }}>
                <Calendar className="w-4 h-4" />
                <span className="text-sm uppercase tracking-wide">
                  {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/wellness" element={<WellnessPage />} />
        </Routes>
      </Layout>
    </MemoryRouter>
  );
};

export default App;
