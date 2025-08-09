import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Settings, Trash2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { UptimeChart } from '../components/website-details/UptimeChart';
import { ScreenshotGrid } from '../components/website-details/ScreenshotGrid';
import { StatusPill } from '../components/ui/StatusPill';
import { Button } from '../components/ui/Button';
import { mockWebsites, generateUptimeData, generateScreenshots } from '../data/mockData';

export const WebsiteDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const website = mockWebsites.find(w => w.id === id);
  
  if (!website) {
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

  const uptimeData = generateUptimeData(website.id);
  const screenshots = generateScreenshots(website.id);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${website.name}"?`)) {
      // In a real app, this would call an API and redirect
      console.log('Delete website:', website.id);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Header showCreateButton={false} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/dashboard"
            className="inline-flex items-center text-gray-400 hover:text-accent-400 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        {/* Website Header */}
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
            <Button variant="secondary" size="md" icon={Settings}>
              Settings
            </Button>
            <Button 
              variant="danger" 
              size="md" 
              icon={Trash2}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
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

        {/* Uptime Chart */}
        <div className="mb-8">
          <UptimeChart data={uptimeData} />
        </div>

        {/* Screenshots */}
        <ScreenshotGrid screenshots={screenshots} />
      </main>
    </div>
  );
};