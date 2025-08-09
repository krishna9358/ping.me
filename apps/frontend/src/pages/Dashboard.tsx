import React from 'react';
import { Header } from '../components/layout/Header';
import { WebsiteTable } from '../components/dashboard/WebsiteTable';
import { mockWebsites } from '../data/mockData';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Monitor and manage your websites</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Websites</p>
                <p className="text-2xl font-bold text-white">{mockWebsites.length}</p>
              </div>
              <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-accent-500 rounded" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Online</p>
                <p className="text-2xl font-bold text-green-400">
                  {mockWebsites.filter(w => w.status === 'up').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Offline</p>
                <p className="text-2xl font-bold text-red-400">
                  {mockWebsites.filter(w => w.status === 'down').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg. Uptime</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(mockWebsites.reduce((acc, w) => acc + w.uptime, 0) / mockWebsites.length * 10) / 10}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-2 bg-blue-400 rounded" />
              </div>
            </div>
          </div>
        </div>

        <WebsiteTable websites={mockWebsites} />
      </main>
    </div>
  );
};