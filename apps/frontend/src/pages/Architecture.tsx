import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { Header } from "../components/layout/Header";
import { Link } from "react-router-dom";
import { ChevronLeft } from "../components/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const Architecture: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const diagram = `
    flowchart LR
      User[💻 User / UI] 
      
      subgraph "Control Plane"
        API[⚙️ REST API]
        DB[(🗄️ PostgreSQL)]
      end
      
      subgraph "Data Plane"
        Queue((🔄 Redis Queue))
        Worker[⚡ Edge Pingers]
        Pusher[📡 WebSocket Pusher]
      end

      Internet((🌐 Target Websites))

      User -- "1. Configure Monitors" --> API
      API -- "2. Store Rules" --> DB
      API -. "3. Schedule Tasks" .-> Queue
      Queue -. "4. Execute Ping" .-> Worker
      Worker -- "5. Uptime Check" --> Internet
      Worker -. "6. Stream Results" .-> Pusher
      Pusher === "7. Live Dashboard Updates" ===> User

      classDef default fill:#222327,stroke:#33353a,stroke-width:2px,color:#f0f0f0,rx:8px,ry:8px,font-family:sans-serif;
      classDef accent fill:#8c5cff,stroke:none,color:#ffffff,rx:8px,ry:8px;
      classDef db fill:#2a2c33,stroke:#33353a,stroke-width:2px,color:#f0f0f0,rx:8px,ry:8px;
      
      class Worker,Pusher accent;
      class DB,Queue,Internet db;
      class User,API default;
  `;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        primaryColor: "#222327",
        primaryTextColor: "#f0f0f0",
        primaryBorderColor: "#33353a",
        lineColor: "#8c5cff",
        secondaryColor: "#2a2c33",
        tertiaryColor: "#161618"
      }
    });
    
    if (chartRef.current) {
      mermaid.render("architecture-diagram", diagram).then(({ svg }) => {
        if (chartRef.current) {
          chartRef.current.innerHTML = svg;
        }
      });
    }
  }, [diagram]);

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-8 relative">
        <div className="mb-6 animate-slide-up">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">System Architecture</h1>
        <p className="text-muted-foreground mb-8">
          The flow of how ping.me orchestrates robust uptime monitoring using an event-driven architecture.
        </p>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex justify-center py-10 relative cursor-grab active:cursor-grabbing">
          <TransformWrapper initialScale={1} minScale={0.1} maxScale={4} centerOnInit>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
              <div ref={chartRef} className="p-8"></div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </main>
    </div>
  );
};
