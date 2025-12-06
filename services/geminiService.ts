import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, FinanceData, CalendarEvent, WaterData, TodoItem, JournalEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FALLBACK_QUOTES = [
  { text: "The future belongs to those who build it.", author: "Elon Musk" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Optimism is an occupational hazard of programming: feedback is the treatment.", author: "Kent Beck" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" }
];

export const getDailyQuote = async (): Promise<{ text: string; author: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Give me a short, powerful, futuristic or stoic quote for a developer/builder. Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            author: { type: Type.STRING },
          },
        },
      },
    });
    
    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text);
  } catch (error) {
    // Silently fallback to offline database
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  }
};

export const getSmartBriefing = async (
  weather: WeatherData | null,
  finance: FinanceData,
  events: CalendarEvent[],
  water: WaterData
): Promise<string> => {
  try {
    const spent = finance.transactions.reduce((acc, t) => acc + t.amount, 0);
    const budgetPercent = finance.budget > 0 ? Math.round((spent / finance.budget) * 100) : 0;
    const hydrationPercent = Math.round((water.current / water.goal) * 100);
    
    // Get events for next 3 days
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    const upcomingEvents = events.filter(e => {
      const eDate = new Date(e.date);
      return eDate >= today && eDate <= threeDaysFromNow;
    });

    const prompt = `
      You are 'Nexus', a high-tech personal dashboard assistant for a developer student.
      
      Status Report:
      - Weather: ${weather ? `${weather.temperature}°C` : 'Unknown'}
      - Financial Status: Spent $${spent} of $${finance.budget} budget (${budgetPercent}% utilized).
      - Hydration Level: ${water.current}/${water.goal} glasses (${hydrationPercent}%).
      - Upcoming Deadlines/Goals (Next 3 days): ${upcomingEvents.map(e => `${e.title} on ${e.date}`).join(", ") || "None"}
      
      Task:
      Write a 2-3 sentence briefing.
      1. If hydration is low (< 50%), aggressively remind me to drink water.
      2. If budget is over 80%, warn me to save money.
      3. Mention the most critical upcoming deadline or goal.
      4. If everything is good, be encouraging.
      Tone: Cyberpunk, professional, encouraging.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Systems online. Ready for input.";
  } catch (error) {
    // Robust Offline Fallback that mimics AI logic
    const spent = finance.transactions.reduce((acc, t) => acc + t.amount, 0);
    const budgetStatus = finance.budget > 0 && (spent / finance.budget) > 0.8 
      ? "Budget utilization critical." 
      : "Financial grid stable.";
    
    const waterStatus = water.current < water.goal / 2 
      ? "Hydration levels suboptimal; initiate intake." 
      : "Bio-metrics nominal.";

    return `Offline Mode: ${budgetStatus} ${waterStatus} Focus on immediate directives.`;
  }
};

export const getPerformanceInsights = async (
  todos: TodoItem[],
  journal: JournalEntry[],
  finance: FinanceData
): Promise<string> => {
  try {
    const completedTodos = todos.filter(t => t.completed).length;
    const totalTodos = todos.length;
    const journalCount = journal.length;
    const latestMood = journal.length > 0 ? (journal[0].mood || 'Unknown') : 'None';
    const spent = finance.transactions.reduce((acc, t) => acc + t.amount, 0);
    
    const prompt = `
      As Nexus AI, analyze this student developer's recent performance to provide a behavioral insight:
      - Task Efficiency: ${completedTodos} completed out of ${totalTodos} active directives.
      - Cognitive Log: ${journalCount} entries. Latest mood state: ${latestMood}.
      - Resource Usage: $${spent} spent vs $${finance.budget} allocated.
      
      Task:
      Provide a single, sharp, personalized insight or recommendation (max 2 sentences).
      Identify a correlation or pattern. (e.g., "High spending correlates with low task completion. Recommend focus blocks.")
      Tone: Analytical, constructive, AI-advisor.
    `;

     const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text || "Insufficient data for pattern analysis.";
  } catch (error) {
    // Dynamic Offline Fallback
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    
    if (totalTodos === 0) {
      return "System Idle: No active directives found. Recommend initializing new protocols to establish momentum.";
    }
    
    if (completedTodos / totalTodos < 0.3) {
      return "Efficiency Alert: Task completion rate is below optimal parameters. Suggest executing a 25-minute focus block immediately.";
    }
    
    if (finance.budget > 0 && (finance.transactions.reduce((a,b)=>a+b.amount,0) / finance.budget) > 0.9) {
      return "Resource Warning: Budget depletion imminent. Recommend halting non-essential resource allocation.";
    }

    return "System Optimal: Performance metrics are within acceptable ranges. Continue current trajectory.";
  }
};