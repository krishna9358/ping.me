import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, Plus, User, LogOut } from "../icons";
import { CreateWebsiteModal } from "../dashboard/CreateWebsiteModal";
import { Button } from "@repo/ui/button";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  showCreateButton?: boolean;
  onWebsiteCreated?: (data: {
    name: string;
    url: string;
    region?: string;
  }) => void | Promise<void>;
}

export const Header: React.FC<HeaderProps> = ({
  showCreateButton = true,
  onWebsiteCreated,
}) => {
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateWebsite = () => setCreateOpen(true);

  const handleCreated = async (data: { name: string; url: string; region?: string }) => {
    await onWebsiteCreated?.(data);
  };

  return (
    <header className="bg-background/80 backdrop-blur border-b border-border px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">ping.me</span>
        </button>

        <div className="flex items-center space-x-4">
          <Link
            to="/architecture"
            className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block mr-2"
          >
            Architecture
          </Link>
        
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
            <Button variant="ghost" size="sm" type="button">
              <User className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <CreateWebsiteModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreated as any}
      />
    </header>
  );
};
