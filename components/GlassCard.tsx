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
        bg-black/50 backdrop-blur-md
        border border-white/10
        rounded-2xl shadow-2xl
        text-neutral-200
        transition-all duration-300 
        hover:bg-black/60 hover:border-white/20 hover:shadow-white/5
        flex flex-col
        ${className}
      `}
      style={isCollapsed ? { height: 'auto', minHeight: '0' } : undefined}
    >
      {(title || action || collapsible) && (
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
          <div className="flex items-center gap-2">
            {title && <h3 className="font-semibold text-xs uppercase tracking-[0.2em] text-neutral-400 select-none drop-shadow-sm">{title}</h3>}
          </div>
          
          <div className="flex items-center gap-2">
            {action && <div>{action}</div>}
            {collapsible && (
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-neutral-500 hover:text-neutral-200"
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