import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { WebsiteTable } from '../components/dashboard/WebsiteTable';
import { mockWebsites as initialWebsites } from '../data/mockData';
import { AnimatedSection } from '../components/ui/AnimatedSection';

export const Dashboard: React.FC = () => {
  const [websites, setWebsites] = useState(initialWebsites);

  const handleWebsiteCreated = (data: { name: string; url: string }) => {
    const newWebsite = {
      id: String(Date.now()),
      name: data.name,
      url: data.url,
      status: 'up' as const,
      lastCheck: new Date(),
      uptime: 100,
      responseTime: 200,
      createdAt: new Date(),
    };
    setWebsites((prev) => [newWebsite, ...prev]);
  };
  return (
    <div className="min-h-screen bg-dark-900 relative">
      <Header onWebsiteCreated={handleWebsiteCreated} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-accent-500/25 blur-[110px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[36rem] h-[36rem] bg-accent-700/25 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-grid-dots opacity-[0.07]" />
      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-8">
        <AnimatedSection className="mb-8" once>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Monitor and manage your websites</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedSection className="bg-gray-800 rounded-xl p-6 border border-gray-700 transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30" delay={0.0}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Websites</p>
                <p className="text-2xl font-bold text-white">{websites.length}</p>
              </div>
              <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-accent-500 rounded" />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="bg-gray-800 rounded-xl p-6 border border-gray-700 transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30" delay={0.05}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Online</p>
                <p className="text-2xl font-bold text-green-400">
                  {websites.filter(w => w.status === 'up').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="bg-gray-800 rounded-xl p-6 border border-gray-700 transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30" delay={0.1}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Offline</p>
                <p className="text-2xl font-bold text-red-400">
                  {websites.filter(w => w.status === 'down').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="bg-gray-800 rounded-xl p-6 border border-gray-700 transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30" delay={0.15}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg. Uptime</p>
                <p className="text-2xl font-bold text-white">
                  {websites.length ? Math.round(websites.reduce((acc, w) => acc + w.uptime, 0) / websites.length * 10) / 10 : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-2 bg-blue-400 rounded" />
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection>
          <WebsiteTable websites={websites} />
        </AnimatedSection>
      </main>
    </div>
  );
};