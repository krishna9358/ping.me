import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ExternalLink,
  Settings,
  Trash2,
} from "../components/icons";
import { Header } from "../components/layout/Header";
import { UptimeChart } from "../components/website-details/UptimeChart";
import { UptimeTimeline } from "../components/website-details/UptimeTimeline";
import { StatusPill } from "../components/ui/StatusPill";
import { Button } from "@repo/ui/button";
import { deleteWebsite, getWebsiteWithTicks } from "../lib/api";
import type { ApiWebsite } from "../lib/mapWebsite";
import { mapApiWebsiteToWebsite } from "../lib/mapWebsite";
import type { UptimeData } from "../types";

export const WebsiteDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [raw, setRaw] = useState<ApiWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWebsiteData = useCallback(async () => {
    if (!id) return;
    try {
      const { website } = await getWebsiteWithTicks(id);
      setRaw(website);
      setError("");
    } catch {
      setError("Could not load this website.");
      setRaw(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWebsiteData();
    const interval = setInterval(() => {
      fetchWebsiteData();
    }, 15000); // 15 seconds refresh
    return () => clearInterval(interval);
  }, [fetchWebsiteData]);

  const website = useMemo(
    () => (raw ? mapApiWebsiteToWebsite(raw) : null),
    [raw]
  );

  const uptimeData: UptimeData[] = useMemo(() => {
    if (!raw?.ticks?.length) return [];
    return [...raw.ticks].reverse().map((t) => ({
      timestamp: new Date(t.createdAt),
      status: t.status === "Up" ? "up" : "down",
      responseTime: t.response_time_ms,
    }));
  }, [raw]);

  const handleDelete = async () => {
    if (!website) return;
    if (
      !window.confirm(
        `Are you sure you want to remove monitoring for "${website.name}"?`
      )
    ) {
      return;
    }
    try {
      await deleteWebsite(website.id);
      navigate("/dashboard");
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (loading && !raw) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Website not found
          </h1>
          <Link
            to="/dashboard"
            className="text-primary hover:text-primary-foreground transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <Header showCreateButton={false} />

      <main className="max-w-7xl mx-auto px-6 py-8 relative">
        <div className="mb-6 animate-slide-up">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {website.name}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">{website.url}</span>
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <StatusPill status={website.status} />
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="secondary" size="md" icon={Settings} type="button">
              Settings
            </Button>
            <Button
              variant="danger"
              size="md"
              icon={Trash2}
              type="button"
              onClick={() => void handleDelete()}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Current Status</p>
            <StatusPill status={website.status} />
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Uptime</p>
            <p className="text-2xl font-bold text-card-foreground">{website.uptime}%</p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Response Time</p>
            <p className="text-2xl font-bold text-card-foreground">
              {website.status === "down" || website.status === "pending"
                ? "—"
                : `${website.responseTime}ms`}
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Monitoring Since</p>
            <p className="text-2xl font-bold text-card-foreground">
              {website.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mb-0">
          <UptimeTimeline data={uptimeData} title="30-Second Checks" totalTicks={90} />
          <UptimeChart data={uptimeData} />
        </div>
      </main>
    </div>
  );
};
