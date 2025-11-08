export interface FiberEntry {
  id: string;
  date: string;
  amount: number;
  description: string;
  timestamp: number;
}

export interface DailyTarget {
  min: number;
  max: number;
}

export interface DayData {
  date: string;
  entries: FiberEntry[];
  total: number;
}

export type StatusColor = 'green' | 'yellow' | 'red';
