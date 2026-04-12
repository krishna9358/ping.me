import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Trash2, Settings } from "../icons";
import { Website } from "../../types";
import { StatusPill } from "../ui/StatusPill";
import { Button } from "@repo/ui/button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { deleteWebsite } from "../../lib/api";

interface WebsiteTableProps {
  websites: Website[];
  onDeleted?: () => void | Promise<void>;
}

export const WebsiteTable: React.FC<WebsiteTableProps> = ({
  websites,
  onDeleted,
}) => {
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    id?: string;
    name?: string;
  }>({ open: false });
  const formatLastCheck = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const askDelete = (websiteId: string, websiteName: string) => {
    setConfirmState({ open: true, id: websiteId, name: websiteName });
  };

  const confirmDelete = () => {
    const id = confirmState.id;
    setConfirmState({ open: false });
    if (!id) return;
    void (async () => {
      try {
        await deleteWebsite(id);
        await onDeleted?.();
      } catch (e) {
        window.alert(e instanceof Error ? e.message : "Delete failed");
      }
    })();
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">
                Website
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">
                Uptime
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">
                Response Time
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">
                Last Check
              </th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {websites.map((website) => (
              <tr
                key={website.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div>
                    <Link
                      to={`/website/${website.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {website.name}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {website.url}
                      </span>
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
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
                  <span className="text-sm text-foreground">
                    {website.uptime}%
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-foreground">
                    {website.status === "down" || website.status === "pending"
                      ? "—"
                      : `${website.responseTime}ms`}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-muted-foreground">
                    {formatLastCheck(website.lastCheck)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => askDelete(website.id, website.name)}
                      className="text-muted-foreground hover:text-destructive"
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
          <div className="text-muted-foreground mb-4">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No websites yet</p>
            <p className="text-sm">
              Add your first website to start monitoring
            </p>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirmState.open}
        title="Delete website?"
        description={`This action will remove ${confirmState.name}. You can’t undo this.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmState({ open: false })}
      />
    </div>
  );
};
