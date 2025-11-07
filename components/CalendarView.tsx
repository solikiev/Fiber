'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { storageUtils, formatDate, getStatusColor } from '@/lib/storage';
import { FiberEntry } from '@/lib/types';
import { Trash2, Edit2, X, Check } from 'lucide-react';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<FiberEntry[]>([]);
  const [target, setTarget] = useState<number>(25);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ amount: '', description: '' });
  const [dailyTotals, setDailyTotals] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadEntriesForDate(selectedDate);
  }, [selectedDate]);

  const loadData = () => {
    const allEntries = storageUtils.getEntries();
    const loadedTarget = storageUtils.getTarget();
    setTarget(loadedTarget);

    // Calculate daily totals
    const totals = new Map<string, number>();
    allEntries.forEach(entry => {
      const current = totals.get(entry.date) || 0;
      totals.set(entry.date, current + entry.amount);
    });
    setDailyTotals(totals);
  };

  const loadEntriesForDate = (date: Date) => {
    const dateStr = formatDate(date);
    const dateEntries = storageUtils.getEntriesForDate(dateStr);
    setEntries(dateEntries);
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setEditingId(null);
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      storageUtils.deleteEntry(id);
      setEntries(entries.filter(e => e.id !== id));
      loadData(); // Reload to update calendar tiles
    }
  };

  const handleStartEdit = (entry: FiberEntry) => {
    setEditingId(entry.id);
    setEditForm({
      amount: entry.amount.toString(),
      description: entry.description,
    });
  };

  const handleSaveEdit = (id: string) => {
    const amount = parseFloat(editForm.amount);
    if (isNaN(amount) || amount <= 0 || !editForm.description.trim()) {
      alert('Please enter a valid amount and description');
      return;
    }

    storageUtils.updateEntry(id, {
      amount,
      description: editForm.description.trim(),
    });

    setEntries(entries.map(e =>
      e.id === id
        ? { ...e, amount, description: editForm.description.trim() }
        : e
    ));
    setEditingId(null);
    loadData(); // Reload to update calendar tiles
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ amount: '', description: '' });
  };

  const selectedDateStr = formatDate(selectedDate);
  const totalForDay = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const statusColor = totalForDay > 0 ? getStatusColor(totalForDay, target) : null;

  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = formatDate(date);
      const total = dailyTotals.get(dateStr);
      
      if (total && total > 0) {
        const color = getStatusColor(total, target);
        const bgColor = 
          color === 'green' ? 'bg-green-500' :
          color === 'yellow' ? 'bg-yellow-500' :
          'bg-red-500';
        
        return (
          <div className="flex flex-col items-center mt-1">
            <div className={`${bgColor} text-white text-xs px-1 rounded font-semibold`}>
              {total.toFixed(0)}g
            </div>
          </div>
        );
      }
    }
    return null;
  };

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = formatDate(date);
      const total = dailyTotals.get(dateStr);
      
      if (total && total > 0) {
        return 'has-fiber-data';
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Fiber History Calendar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your fiber intake history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={getTileContent}
              tileClassName={getTileClassName}
              className="rounded-lg border-0"
            />
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Legend:
            </h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Target met</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Below target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Exceeded</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>

          {totalForDay > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalForDay.toFixed(1)}g
                </span>
              </div>
              {statusColor && (
                <div className="mt-2">
                  <div
                    className={`px-3 py-1 rounded text-center text-sm font-semibold ${
                      statusColor === 'green'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : statusColor === 'yellow'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {statusColor === 'green' && totalForDay > target * 1.5
                      ? 'Exceeded target'
                      : statusColor === 'green'
                      ? 'Target met'
                      : `${(target - totalForDay).toFixed(1)}g below target`}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="border-t dark:border-gray-700 pt-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Entries
            </h4>
            {entries.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No entries for this day
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    {editingId === entry.id ? (
                      <div className="flex-1 space-y-2">
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={(e) =>
                            setEditForm({ ...editForm, amount: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          step="0.1"
                          min="0"
                          placeholder="Amount (g)"
                        />
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          placeholder="Description"
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {entry.amount}g
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {entry.description}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 ml-4">
                      {editingId === entry.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(entry.id)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded"
                            title="Save"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(entry)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .calendar-container .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        
        .calendar-container .react-calendar__tile {
          padding: 0.75em 0.5em;
          position: relative;
          height: 80px;
        }
        
        .calendar-container .react-calendar__tile.has-fiber-data {
          background-color: rgba(59, 130, 246, 0.05);
        }
        
        .calendar-container .react-calendar__tile:enabled:hover {
          background-color: rgba(59, 130, 246, 0.1);
        }
        
        .calendar-container .react-calendar__tile--active {
          background: #3b82f6 !important;
          color: white;
        }
        
        .calendar-container .react-calendar__tile--active:enabled:hover {
          background: #2563eb !important;
        }
        
        .calendar-container .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .calendar-container .react-calendar__navigation button:enabled:hover {
          background-color: rgba(59, 130, 246, 0.1);
        }
        
        .dark .calendar-container .react-calendar {
          background: transparent;
          color: white;
        }
        
        .dark .calendar-container .react-calendar__tile {
          color: white;
        }
        
        .dark .calendar-container .react-calendar__tile.has-fiber-data {
          background-color: rgba(59, 130, 246, 0.15);
        }
        
        .dark .calendar-container .react-calendar__tile:enabled:hover {
          background-color: rgba(59, 130, 246, 0.2);
        }
        
        .dark .calendar-container .react-calendar__navigation button {
          color: white;
        }
        
        .dark .calendar-container .react-calendar__month-view__days__day--neighboringMonth {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
