import { FiberEntry, DailyTarget } from './types';

const ENTRIES_KEY = 'fiber_entries';
const TARGET_KEY = 'fiber_target';
const DEFAULT_TARGET_MIN = 25;
const DEFAULT_TARGET_MAX = 30;

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

export const storageUtils = {
  // Get all fiber entries
  getEntries: (): FiberEntry[] => {
    if (!isBrowser) return [];
    try {
      const data = localStorage.getItem(ENTRIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading entries from localStorage:', error);
      return [];
    }
  },

  // Save all fiber entries
  saveEntries: (entries: FiberEntry[]): void => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries to localStorage:', error);
    }
  },

  // Add a new fiber entry
  addEntry: (entry: Omit<FiberEntry, 'id' | 'timestamp'>): FiberEntry => {
    const newEntry: FiberEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    const entries = storageUtils.getEntries();
    entries.push(newEntry);
    storageUtils.saveEntries(entries);
    return newEntry;
  },

  // Update an existing entry
  updateEntry: (id: string, updates: Partial<FiberEntry>): void => {
    const entries = storageUtils.getEntries();
    const index = entries.findIndex(e => e.id === id);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updates };
      storageUtils.saveEntries(entries);
    }
  },

  // Delete an entry
  deleteEntry: (id: string): void => {
    const entries = storageUtils.getEntries();
    const filtered = entries.filter(e => e.id !== id);
    storageUtils.saveEntries(filtered);
  },

  // Get entries for a specific date
  getEntriesForDate: (date: string): FiberEntry[] => {
    const entries = storageUtils.getEntries();
    return entries.filter(e => e.date === date);
  },

  // Get daily target range
  getTarget: (): DailyTarget => {
    if (!isBrowser) return { min: DEFAULT_TARGET_MIN, max: DEFAULT_TARGET_MAX };
    try {
      const data = localStorage.getItem(TARGET_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Handle old format (single number) and migrate to new format
        if (typeof parsed === 'number') {
          return { min: parsed, max: parsed + 5 };
        }
        return parsed;
      }
      return { min: DEFAULT_TARGET_MIN, max: DEFAULT_TARGET_MAX };
    } catch (error) {
      console.error('Error reading target from localStorage:', error);
      return { min: DEFAULT_TARGET_MIN, max: DEFAULT_TARGET_MAX };
    }
  },

  // Save daily target range
  saveTarget: (target: DailyTarget): void => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(TARGET_KEY, JSON.stringify(target));
    } catch (error) {
      console.error('Error saving target to localStorage:', error);
    }
  },

  // Get total fiber for a specific date
  getTotalForDate: (date: string): number => {
    const entries = storageUtils.getEntriesForDate(date);
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  },
};

// Utility to format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = (): string => {
  return formatDate(new Date());
};

// Determine status color based on actual vs target range
export const getStatusColor = (actual: number, target: DailyTarget): 'green' | 'yellow' | 'red' => {
  if (actual >= target.min && actual <= target.max) {
    return 'green'; // Within target range
  } else if (actual < target.min) {
    return 'yellow'; // Below minimum
  } else {
    return 'red'; // Above maximum
  }
};