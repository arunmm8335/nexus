import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, DollarSign, Book, HeartPulse, Menu } from 'lucide-react';

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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10 z-