
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  collapsible?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  title, 
  action,
  collapsible = false 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`
        relative overflow-hidden
        backdrop-blur-xl
        rounded-2xl shadow-2xl
        transition-all duration-300 
        flex flex-col h-full
        ${className}
      `}
      style={{
        backgroundColor: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        borderWidth: '1px',
        color: 'var(--text-main)',
        ...(isCollapsed ? { height: 'auto', minHeight: '0' } : undefined)
      }}
    >
      {(title || action || collapsible) && (
        <div className="px-6 py-4 border-b flex justify-between items-center shrink-0 group" style={{ borderColor: 'var(--glass-border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-2">
            {title && <h3 className="font-semibold text-xs uppercase tracking-[0.2em] select-none drop-shadow-sm opacity-70" style={{ color: 'var(--text-muted)' }}>{title}</h3>}
          </div>
          
          <div className="flex items-center gap-2" onMouseDown={e => e.stopPropagation()}>
            {action && <div>{action}</div>}
            {collapsible && (
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-lg transition-colors opacity-60 hover:opacity-100"
                style={{ color: 'var(--text-main)' }}
                aria-label={isCollapsed ? "Expand" : "Collapse"}
              >
                {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      )}
      
      {!isCollapsed && (
        <div className="p-6 flex-1 flex flex-col min-h-0 relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};
