import { ActivityPoint } from '../types';

const GQL_ENDPOINT = "https://api.github.com/graphql";

export const getStoredAuth = () => {
  return {
    token: localStorage.getItem('nexus_gh_token'),
    username: localStorage.getItem('nexus_gh_username')
  };
};

export const saveAuth = (username: string, token: string) => {
  localStorage.setItem('nexus_gh_username', username);
  localStorage.setItem('nexus_gh_token', token);
};

export const clearAuth = () => {
  localStorage.removeItem('nexus_gh_username');
  localStorage.removeItem('nexus_gh_token');
};

export const getAuthHeaders = () => {
  const { token } = getStoredAuth();
  return token ? { 'Authorization': `token ${token}` } : {};
};

export const fetchUserContributions = async (): Promise<{points: ActivityPoint[], total: number, streak: number}> => {
  const { token, username } = getStoredAuth();
  if (!token || !username) throw new Error("Missing credentials");

  const query = `
    query($userName:String!) {
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { userName: username }
    }),
  });

  const json = await response.json();
  
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  const calendar = json.data.user.contributionsCollection.contributionCalendar;
  
  // Process Data for Chart (Last 14 days)
  const days: any[] = [];
  calendar.weeks.forEach((week: any) => {
    week.contributionDays.forEach((day: any) => {
      days.push(day);
    });
  });

  // Get last 14 days
  const recentDays = days.slice(-14);
  const points: ActivityPoint[] = recentDays.map((d: any) => ({
    day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    commits: d.contributionCount
  }));

  // Calculate Streak
  // Reverse iterate from today
  let streak = 0;
  // Sort by date descending just to be safe
  const sortedDays = [...days].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Check if today has a contribution
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = sortedDays.find(d => d.date === todayStr);
  
  // If we haven't contributed today yet, don't break the streak immediately, 
  // check yesterday. If we have contributed today, start counting from today.
  let startIndex = 0;
  if (todayEntry && todayEntry.contributionCount === 0) {
    // If today is 0, check yesterday to start streak count
    // Note: This logic assumes user wants "current active streak". 
    // If they missed yesterday, streak is 0.
    startIndex = 1; 
  }

  for (let i = startIndex; i < sortedDays.length; i++) {
    if (sortedDays[i].contributionCount > 0) {
      streak++;
    } else {
      break;
    }
  }

  return {
    points,
    total: calendar.totalContributions,
    streak
  };
};