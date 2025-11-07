export interface FiberEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  amount: number; // grams of fiber
  description: string; // meal name or description
  timestamp: number; // Unix timestamp
}

export interface DailyTarget {
  amount: number; // daily fiber target in grams
}

export interface DayData {
  date: string;
  entries: FiberEntry[];
  total: number;
}

export type StatusColor = 'green' | 'yellow' | 'red';
