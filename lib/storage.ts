import { FiberEntry, DailyTarget } from './types';

const ENTRIES_KEY = 'fiber_entries';
const TARGET_KEY = 'fiber_target';
const DEFAULT_TARGET = 25; // Default daily fiber target in grams

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

  // Get daily target
  getTarget: (): number => {
    if (!isBrowser) return DEFAULT_TARGET;
    try {
      const data = localStorage.getItem(TARGET_KEY);
      return data ? JSON.parse(data) : DEFAULT_TARGET;
    } catch (error) {
      console.error('Error reading target from localStorage:', error);
      return DEFAULT_TARGET;
    }
  },

  // Save daily target
  saveTarget: (target: number): void => {
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

// Determine status color based on actual vs target
export const getStatusColor = (actual: number, target: number): 'green' | 'yellow' | 'red' => {
  if (actual >= target) {
    // Check if it's too much (more than 50% over target)
    if (actual > target * 1.5) {
      return 'red';
    }
    return 'green';
  }
  // Below target
  return 'yellow';
};
