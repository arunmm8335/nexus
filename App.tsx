import React from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { FinancePage } from './pages/FinancePage';
import { JournalPage } from './pages/JournalPage';
import { WellnessPage } from './pages/WellnessPage';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="flex min-h-screen bg-transparent text-neutral-200">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-20 lg:ml-64 transition-all duration-300 overflow-x-hidden">
         {/* Global Header */}
         <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <LayoutDashboard className="w-8 h-8 text-sky-400" />
              <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
                NEXUS
              </h1>
            </div>
            <p className="text-neutral-500 text-sm tracking-widest uppercase font-medium">{getPageTitle(location.pathname)}</p>
          </div>
          
          <div className="text-right hidden md:block">
            <div className="text-5xl font-extralight tracking-tight text-white">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center justify-end text-neutral-500 mt-1 space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wide">
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
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