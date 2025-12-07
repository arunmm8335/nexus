
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, DollarSign, Book, HeartPulse } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/finance', icon: DollarSign, label: 'Finance' },
    { to: '/journal', icon: Book, label: 'Journal' },
    { to: '/wellness', icon: HeartPulse, label: 'Wellness' },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 flex justify-around p-3 transition-colors duration-300"
        style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
      >
         {navItems.map(item => (
            <NavLink 
              key={item.to} 
              to={item.to}
              className={({ isActive }) => `p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${isActive ? 'bg-white/10' : 'opacity-60'}`}
              style={({ isActive }) => ({ color: isActive ? 'var(--text-main)' : 'var(--text-muted)' })}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold">{item.label}</span>
            </NavLink>
         ))}
      </div>

      {/* Desktop Sidebar */}
      <div 
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 lg:w-64 flex-col backdrop-blur-xl border-r z-40 transition-all duration-300"
        style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
      >
        <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-white/90">
            <span className="font-bold text-black">N</span>
          </div>
          <span className="font-bold text-xl tracking-wider hidden lg:block drop-shadow-md" style={{ color: 'var(--text-main)' }}>NEXUS</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-white/10 border shadow-lg shadow-white/5' 
                  : 'hover:bg-white/5'}
              `}
              style={({ isActive }) => ({ 
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                borderColor: isActive ? 'var(--glass-border)' : 'transparent'
              })}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium tracking-wide hidden lg:block">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs backdrop-blur-md" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'var(--glass-border)', color: 'var(--text-muted)' }}>
                 US
              </div>
              <div className="hidden lg:block">
                 <div className="text-sm font-medium shadow-black drop-shadow-md" style={{ color: 'var(--text-main)' }}>User System</div>
                 <div className="text-[10px] text-green-400 drop-shadow-sm">● Online</div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};
