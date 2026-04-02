import React, { useCallback, useEffect, useState } from "react";
import { Header } from "../components/layout/Header";
import { WebsiteTable } from "../components/dashboard/WebsiteTable";
import { AnimatedSection } from "../components/ui/AnimatedSection";
import { createWebsite, listWebsites } from "../lib/api";
import { mapApiWebsiteToWebsite } from "../lib/mapWebsite";
import type { Website } from "../types";
import { Globe, CheckCircle2, XCircle, Activity } from "../components/icons";

export const Dashboard: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadWebsites = useCallback(async () => {
    try {
      setLoadError("");
      const { websites: list } = await listWebsites();
      setWebsites(list.map((w) => mapApiWebsiteToWebsite(w)));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load websites");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWebsites();
    const intervalId = setInterval(() => {
      void loadWebsites();
    }, 15000); // Auto-refresh every 15 seconds
    return () => clearInterval(intervalId);
  }, [loadWebsites]);

  const handleWebsiteCreated = async (data: { name: string; url: string; region?: string }) => {
    await createWebsite(data.url);
    await loadWebsites();
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <Header onWebsiteCreated={handleWebsiteCreated} />

      <main className="relative max-w-7xl mx-auto px-6 py-8">
        <AnimatedSection className="mb-8" once>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your websites</p>
        </AnimatedSection>

        {loadError ? <p className="text-destructive mb-4">{loadError}</p> : null}

        {loading && websites.length === 0 ? (
          <p className="text-muted-foreground">Loading websites…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <AnimatedSection
                className="bg-card rounded-xl p-6 border border-border shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                delay={0.0}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Websites</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {websites.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection
                className="bg-card rounded-xl p-6 border border-border shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                delay={0.05}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Online</p>
                    <p className="text-2xl font-bold text-chart-1">
                      {websites.filter((w) => w.status === "up").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-chart-1" />
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection
                className="bg-card rounded-xl p-6 border border-border shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                delay={0.1}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Offline</p>
                    <p className="text-2xl font-bold text-destructive">
                      {websites.filter((w) => w.status === "down").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-destructive" />
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection
                className="bg-card rounded-xl p-6 border border-border shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                delay={0.15}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg. Uptime</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {websites.length
                        ? Math.round(
                            (websites.reduce((acc, w) => acc + w.uptime, 0) /
                              websites.length) *
                              10,
                          ) / 10
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-chart-4" />
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection>
              <WebsiteTable
                websites={websites}
                onDeleted={() => void loadWebsites()}
              />
            </AnimatedSection>
          </>
        )}
      </main>
    </div>
  );
};

