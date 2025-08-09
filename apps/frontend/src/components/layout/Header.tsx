import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Plus, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  showCreateButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showCreateButton = true }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you'd clear auth tokens here
    navigate('/login');
  };

  const handleCreateWebsite = () => {
    // In a real app, this would open a modal or navigate to create page
    alert('Create website modal would open here');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link 
          to="/dashboard" 
          className="flex items-center space-x-3 text-white hover:text-accent-400 transition-colors"
        >
          <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold">UptimeWatch</span>
        </Link>
        
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
    </header>
  );
};