import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Settings, Trash2 } from '../components/icons';
import { Header } from '../components/layout/Header';
import { UptimeChart } from '../components/website-details/UptimeChart';
import { ScreenshotGrid } from '../components/website-details/ScreenshotGrid';
import { StatusPill } from '../components/ui/StatusPill';
import { Button } from '@repo/ui/button';
import { deleteWebsite, getWebsiteWithTicks } from '../lib/api';
import type { ApiWebsite } from '../lib/mapWebsite';
import { mapApiWebsiteToWebsite } from '../lib/mapWebsite';
import type { UptimeData } from '../types';

export const WebsiteDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [raw, setRaw] = useState<ApiWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { website } = await getWebsiteWithTicks(id);
        if (!cancelled) {
          setRaw(website);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Could not load this website.');
          setRaw(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const website = useMemo(
    () => (raw ? mapApiWebsiteToWebsite(raw) : null),
    [raw],
  );

  const uptimeData: UptimeData[] = useMemo(() => {
    if (!raw?.ticks?.length) return [];
    return [...raw.ticks].reverse().map((t) => ({
      timestamp: new Date(t.createdAt),
      status: t.status === 'Up' ? 'up' : 'down',
      responseTime: t.response_time_ms,
    }));
  }, [raw]);

  const handleDelete = async () => {
    if (!website) return;
    if (!window.confirm(`Are you sure you want to remove monitoring for "${website.name}"?`)) {
      return;
    }
    try {
      await deleteWebsite(website.id);
      navigate('/dashboard');
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gray-400">Loading…</p>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Website not found</h1>
          <Link to="/dashboard" className="text-accent-400 hover:text-accent-300">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Header showCreateButton={false} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 animate-slide-up">
          <Link 
            to="/dashboard"
            className="inline-flex items-center text-gray-400 hover:text-accent-400 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{website.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">{website.url}</span>
                <a 
                  href={website.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-accent-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <StatusPill status={website.status} />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="secondary" size="md" icon={Settings} type="button">
              Settings
            </Button>
            <Button 
              variant="danger" 
              size="md" 
              icon={Trash2}
              type="button"
              onClick={() => void handleDelete()}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Current Status</p>
            <StatusPill status={website.status} />
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Uptime</p>
            <p className="text-2xl font-bold text-white">{website.uptime}%</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Response Time</p>
            <p className="text-2xl font-bold text-white">
              {website.status === 'down' ? '—' : `${website.responseTime}ms`}
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Monitoring Since</p>
            <p className="text-2xl font-bold text-white">
              {website.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <UptimeChart data={uptimeData} />
        </div>

        <ScreenshotGrid screenshots={[]} />
      </main>
    </div>
  );
};
