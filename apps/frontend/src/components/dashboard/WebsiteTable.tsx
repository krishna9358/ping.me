import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MoreVertical, Trash2, Settings } from 'lucide-react';
import { Website } from '../../types';
import { StatusPill } from '../ui/StatusPill';
import { Button } from '../ui/Button';

interface WebsiteTableProps {
  websites: Website[];
}

export const WebsiteTable: React.FC<WebsiteTableProps> = ({ websites }) => {
  const formatLastCheck = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const handleDelete = (websiteId: string, websiteName: string) => {
    if (window.confirm(`Are you sure you want to delete "${websiteName}"?`)) {
      // In a real app, this would call an API to delete the website
      console.log('Delete website:', websiteId);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Website</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Status</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Uptime</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Response Time</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Last Check</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {websites.map((website) => (
              <tr key={website.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="py-4 px-6">
                  <div>
                    <Link 
                      to={`/website/${website.id}`}
                      className="font-medium text-white hover:text-accent-400 transition-colors"
                    >
                      {website.name}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-400">{website.url}</span>
                      <a 
                        href={website.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-accent-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <StatusPill status={website.status} size="sm" />
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-300">{website.uptime}%</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-300">
                    {website.status === 'down' ? '—' : `${website.responseTime}ms`}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-400">{formatLastCheck(website.lastCheck)}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(website.id, website.name)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {websites.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No websites yet</p>
            <p className="text-sm">Add your first website to start monitoring</p>
          </div>
        </div>
      )}
    </div>
  );
};