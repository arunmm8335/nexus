
import React, { useEffect, useState } from 'react';
import { Cloud, Sun, Moon, Wind, Loader2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { fetchWeather, getWeatherDescription } from '../services/weatherService';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  onWeatherUpdate: (data: WeatherData) => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ onWeatherUpdate }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeather(position.coords.latitude, position.coords.longitude);
          setWeather(data);
          onWeatherUpdate(data);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch weather");
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  if (loading) {
    return (
      <GlassCard title="Atmospherics" className="h-full min-h-[220px] justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400 mx-auto" />
      </GlassCard>
    );
  }

  if (error || !weather) {
    return (
      <GlassCard title="Atmospherics" className="h-full min-h-[220px]">
        <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
          <Cloud className="w-10 h-10 mb-2" />
          <span>{error || "No Data"}</span>
        </div>
      </GlassCard>
    );
  }

  const WeatherIcon = weather.isDay ? Sun : Moon;

  return (
    <GlassCard title="Atmospherics" className="h-full min-h-[220px]">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-start justify-between mt-2">
          <div>
            <div className="text-6xl font-light tracking-tighter" style={{ color: 'var(--text-main)' }}>
              {Math.round(weather.temperature)}°
            </div>
            <div className="text-lg font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
              {getWeatherDescription(weather.weatherCode)}
            </div>
          </div>
          <div className="animate-float">
             <WeatherIcon className={`w-20 h-20 ${weather.isDay ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'text-sky-300 drop-shadow-[0_0_15px_rgba(125,211,252,0.5)]'}`} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3 flex items-center space-x-3 transition-colors" style={{ backgroundColor: 'var(--input-bg)' }}>
            <Wind className="w-5 h-5 text-sky-400" />
            <div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Wind</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{weather.windSpeed} km/h</div>
            </div>
          </div>
           <div className="rounded-lg p-3 flex items-center space-x-3 transition-colors" style={{ backgroundColor: 'var(--input-bg)' }}>
             <div className={`w-3 h-3 rounded-full shadow-lg ${weather.isDay ? 'bg-amber-400 shadow-amber-500/50' : 'bg-indigo-500 shadow-indigo-500/50'}`}></div>
            <div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Cycle</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{weather.isDay ? 'Day' : 'Night'}</div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
