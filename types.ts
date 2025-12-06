
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
}

export interface ActivityPoint {
  day: string;
  commits: number;
}

export interface QuoteData {
  text: string;
  author: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  receiptUrl?: string; // Simulating a file upload
  note?: string;
}

export interface FinanceData {
  budget: number;
  transactions: Transaction[];
}

export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  title: string;
  type: 'deadline' | 'goal' | 'event';
}

export interface WaterData {
  current: number;
  goal: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mood?: string;
}

export interface CycleData {
  lastPeriodDate: string; // YYYY-MM-DD
  cycleLength: number; // Average 28
  periodLength: number; // Average 5
  isLogMode?: boolean;
}