'use client';

import { useState, useEffect } from 'react';
import { storageUtils, getTodayDate, getStatusColor } from '@/lib/storage';
import { FiberEntry, DailyTarget } from '@/lib/types';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

export default function Dashboard() {
  const [entries, setEntries] = useState<FiberEntry[]>([]);
  const [target, setTarget] = useState<DailyTarget>({ min: 25, max: 30 });
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState({ min: '25', max: '30' });
  const [newEntry, setNewEntry] = useState({ amount: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ amount: '', description: '' });

  const todayDate = getTodayDate();

  useEffect(() => {
    const loadedEntries = storageUtils.getEntriesForDate(todayDate);
    const loadedTarget = storageUtils.getTarget();
    setEntries(loadedEntries);
    setTarget(loadedTarget);
    setTempTarget({ min: loadedTarget.min.toString(), max: loadedTarget.max.toString() });
  }, [todayDate]);

  const totalFiber = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const statusColor = getStatusColor(totalFiber, target);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newEntry.amount);
    if (isNaN(amount) || amount <= 0 || !newEntry.description.trim()) {
      alert('Please enter a valid amount and description');
      return;
    }

    const entry = storageUtils.addEntry({
      date: todayDate,
      amount,
      description: newEntry.description.trim(),
    });

    setEntries([...entries, entry]);
    setNewEntry({ amount: '', description: '' });
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      storageUtils.deleteEntry(id);
      setEntries(entries.filter(e => e.id !== id));
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
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ amount: '', description: '' });
  };

  const handleSaveTarget = () => {
    const newMin = parseFloat(tempTarget.min);
    const newMax = parseFloat(tempTarget.max);
    
    if (isNaN(newMin) || isNaN(newMax) || newMin <= 0 || newMax <= 0) {
      alert('Please enter valid target amounts');
      return;
    }
    
    if (newMin > newMax) {
      alert('Minimum target cannot be greater than maximum target');
      return;
    }
    
    const newTarget = { min: newMin, max: newMax };
    storageUtils.saveTarget(newTarget);
    setTarget(newTarget);
    setIsEditingTarget(false);
  };

  const handleCancelTargetEdit = () => {
    setTempTarget({ min: target.min.toString(), max: target.max.toString() });
    setIsEditingTarget(false);
  };

  const getStatusText = () => {
    if (statusColor === 'green') {
      return 'Within target range!';
    } else if (statusColor === 'yellow') {
      return `${(target.min - totalFiber).toFixed(1)}g below minimum`;
    } else {
      return `${(totalFiber - target.max).toFixed(1)}g above maximum`;
    }
  };

  const getStatusBgColor = () => {
    switch (statusColor) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Fiber Intake Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your daily fiber intake
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Today&apos;s Total
            </h2>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {totalFiber.toFixed(1)}g
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Target:</span>
              {isEditingTarget ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempTarget.min}
                    onChange={(e) => setTempTarget({ ...tempTarget, min: e.target.value })}
                    className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    step="0.1"
                    min="0"
                    placeholder="Min"
                  />
                  <span className="text-gray-600 dark:text-gray-400">-</span>
                  <input
                    type="number"
                    value={tempTarget.max}
                    onChange={(e) => setTempTarget({ ...tempTarget, max: e.target.value })}
                    className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    step="0.1"
                    min="0"
                    placeholder="Max"
                  />
                  <button
                    onClick={handleSaveTarget}
                    className="p-1 text-green-600 hover:text-green-700"
                    title="Save"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancelTargetEdit}
                    className="p-1 text-red-600 hover:text-red-700"
                    title="Cancel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    {target.min}g - {target.max}g
                  </span>
                  <button
                    onClick={() => setIsEditingTarget(true)}
                    className="p-1 text-blue-600 hover:text-blue-700"
                    title="Edit target"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div
              className={`px-4 py-2 rounded-lg border-2 text-center font-semibold ${getStatusBgColor()}`}
            >
              {getStatusText()}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Add Fiber Entry
        </h3>
        <form onSubmit={handleAddEntry} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Amount (grams)
              </label>
              <input
                id="amount"
                type="number"
                value={newEntry.amount}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, amount: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 10"
                step="0.1"
                min="0"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description / Meal
              </label>
              <input
                id="description"
                type="text"
                value={newEntry.description}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Oatmeal breakfast"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Entry
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Today&apos;s Entries
        </h3>
        {entries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No entries yet. Add your first fiber entry above!
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                {editingId === entry.id ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) =>
                        setEditForm({ ...editForm, amount: e.target.value })
                      }
                      className="px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      step="0.1"
                      min="0"
                    />
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {entry.amount}g
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
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
  );
}