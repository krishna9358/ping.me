import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Plus, User, LogOut } from '../icons';
import { CreateWebsiteModal } from '../dashboard/CreateWebsiteModal';
import { useState } from 'react';
import { Button } from '../ui/Button';

interface HeaderProps {
  showCreateButton?: boolean;
  onWebsiteCreated?: (data: { name: string; url: string }) => void;
}

export const Header: React.FC<HeaderProps> = ({ showCreateButton = true, onWebsiteCreated }) => {
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you'd clear auth tokens here
    navigate('/login');
  };

  const handleCreateWebsite = () => setCreateOpen(true);

  const handleCreated = (data: { name: string; url: string }) => {
    // TODO: Hook into API once backend is ready
    onWebsiteCreated?.(data);
  };

  return (
    <header className="bg-gray-800/80 backdrop-blur border-b border-gray-700 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-3 text-white hover:text-accent-400 transition-colors"
        >
          <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">ping.me</span>
        </button>
        
        <div className="flex items-center space-x-4">
          {showCreateButton && (
            <Button 
              variant="primary" 
              icon={Plus} 
              onClick={handleCreateWebsite}
              size="md"
            >
              Create Website
            </Button>
          )}
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <CreateWebsiteModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreated}
      />
    </header>
  );
};