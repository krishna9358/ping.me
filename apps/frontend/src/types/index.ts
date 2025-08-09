export interface Website {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'maintenance';
  lastCheck: Date;
  uptime: number;
  responseTime: number;
  createdAt: Date;
}

export interface UptimeData {
  timestamp: Date;
  status: 'up' | 'down';
  responseTime: number;
}

export interface Screenshot {
  id: string;
  timestamp: Date;
  url: string;
  thumbnailUrl: string;
}