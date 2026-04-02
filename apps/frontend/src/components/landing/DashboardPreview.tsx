import React from "react";
import { CheckCircle2, Globe, Server, Activity, Clock } from "../icons";

export const DashboardPreview: React.FC = () => {
  return (
    <div className="bg-[#121316] w-full h-[600px] border border-[#27272a] rounded-xl flex flex-col font-sans select-none overflow-hidden text-gray-300">
      
      {/* Top App Bar Preview */}
      <div className="h-14 border-b border-[#27272a] flex items-center px-4 bg-[#0a0a0c]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
          <div className="w-3 h-3 rounded-full bg-[#eab308]"></div>
          <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Preview */}
        <div className="w-64 border-r border-[#27272a] bg-[#121316] p-4 flex flex-col space-y-2">
          <div className="flex items-center space-x-3 text-white px-3 py-2 rounded-lg bg-[#27272a]/50">
            <Globe className="w-4 h-4" />
            <span className="font-medium text-sm">Monitors</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400 px-3 py-2">
            <Activity className="w-4 h-4" />
            <span className="font-medium text-sm">Incidents</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400 px-3 py-2">
            <Clock className="w-4 h-4" />
            <span className="font-medium text-sm">Heartbeats</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400 px-3 py-2">
            <Server className="w-4 h-4" />
            <span className="font-medium text-sm">Status pages</span>
          </div>
        </div>

        {/* Main Content Preview */}
        <div className="flex-1 bg-[#09090b] p-8 overflow-hidden">
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <span>&lt; Monitors</span>
          </div>

          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                time.com/status
              </h2>
              <p className="text-sm text-gray-400">
                <span className="text-green-500">Up</span> • Checked every 30 seconds
              </p>
            </div>
          </div>

          <div className="flex space-x-4 mb-8">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex-1 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Monitor is up for</p>
              <p className="text-xl font-bold text-white">4 days 1 hour 4 minutes</p>
            </div>
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex-1 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Last checked</p>
              <p className="text-xl font-bold text-white">16 seconds ago</p>
            </div>
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex-1 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Incidents</p>
              <p className="text-xl font-bold text-white">17</p>
            </div>
          </div>

          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 h-64 relative">
             <p className="text-sm text-gray-400 font-semibold mb-4">Response times</p>
             
             {/* Fake Graph */}
             <div className="absolute bottom-6 left-6 right-6 top-16 flex items-end justify-between space-x-1 opacity-70">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-[#6366f1]/20 to-[#6366f1]/60 rounded-t-sm" style={{ height: `${Math.floor(Math.random() * 40) + 20}%` }}></div>
                ))}
             </div>

             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-[#27272a] border border-[#3f3f46] rounded-xl p-4 shadow-2xl z-10">
               <p className="text-xs text-gray-400 mb-1">Jul 31 at 3:21pm PT</p>
               <p className="text-lg font-bold text-white mb-3">1200 ms <span className="text-sm font-normal text-gray-500">Total</span></p>
               
               <div className="flex justify-between text-xs mb-2">
                 <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>Start transfer</span>
                 <span className="text-white">450 ms</span>
               </div>
               <div className="flex justify-between text-xs mb-2">
                 <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-pink-400 mr-2"></div>Redirect</span>
                 <span className="text-white">450 ms</span>
               </div>
               <div className="flex justify-between text-xs">
                 <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></div>Pre-transfer</span>
                 <span className="text-white">450 ms</span>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
