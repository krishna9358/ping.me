import { Website, UptimeData, Screenshot } from '../types';

export const mockWebsites: Website[] = [
  {
    id: '1',
    name: 'My Portfolio',
    url: 'https://myportfolio.com',
    status: 'up',
    lastCheck: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    uptime: 99.8,
    responseTime: 245,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    id: '2',
    name: 'E-commerce Store',
    url: 'https://mystore.com',
    status: 'up',
    lastCheck: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    uptime: 99.9,
    responseTime: 180,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
  },
  {
    id: '3',
    name: 'Blog Site',
    url: 'https://myblog.com',
    status: 'down',
    lastCheck: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
    uptime: 95.2,
    responseTime: 0,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
  },
  {
    id: '4',
    name: 'API Service',
    url: 'https://api.myservice.com',
    status: 'maintenance',
    lastCheck: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    uptime: 99.5,
    responseTime: 320,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
  {
    id: '5',
    name: 'Landing Page',
    url: 'https://landing.example.com',
    status: 'up',
    lastCheck: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    uptime: 100,
    responseTime: 150,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
];

export const generateUptimeData = (websiteId: string): UptimeData[] => {
  const data: UptimeData[] = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000); // hourly data for last 24 hours
    const isUp = Math.random() > (websiteId === '3' ? 0.1 : 0.02); // Website 3 has more downtime
    
    data.unshift({
      timestamp,
      status: isUp ? 'up' : 'down',
      responseTime: isUp ? Math.floor(Math.random() * 400) + 100 : 0,
    });
  }
  
  return data;
};

export const generateScreenshots = (websiteId: string): Screenshot[] => {
  const screenshots: Screenshot[] = [];
  const now = new Date();
  
  for (let i = 0; i < 12; i++) {
    const timestamp = new Date(now.getTime() - i * 2 * 60 * 60 * 1000); // screenshots every 2 hours
    screenshots.unshift({
      id: `${websiteId}-screenshot-${i}`,
      timestamp,
      url: `https://picsum.photos/1920/1080?random=${websiteId}-${i}`,
      thumbnailUrl: `https://picsum.photos/400/300?random=${websiteId}-${i}`,
    });
  }
  
  return screenshots;
};