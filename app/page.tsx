'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import CalendarView from '@/components/CalendarView';
import { Calendar, Home as HomeIcon } from 'lucide-react';

export default function Home() {
  const [activeView, setActiveView] = useState<'dashboard' | 'calendar'>('dashboard');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeView === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Calendar</span>
            </button>
          </div>
        </nav>

        {/* Content */}
        <div>
          {activeView === 'dashboard' ? <Dashboard /> : <CalendarView />}
        </div>
      </div>
    </main>
  );
}
