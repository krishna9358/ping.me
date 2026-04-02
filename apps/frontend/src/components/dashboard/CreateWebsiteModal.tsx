import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "@repo/ui/button";
import { Globe, Activity } from "../icons";

interface CreateWebsiteModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; url: string; region: string }) => void | Promise<void>;
}

export const CreateWebsiteModal: React.FC<CreateWebsiteModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    setError("");
    setSubmitting(true);
    try {
      await onCreate({ name, url, region });
      setName("");
      setUrl("");
      setRegion("us-east-1");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create website");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a website"
      description="Start monitoring a new website by providing its name and URL."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg py-2 px-3">
            {error}
          </p>
        ) : null}
        <Input
          label="Website name"
          placeholder="e.g. Marketing site"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="URL"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          icon={Globe}
          required
          type="url"
          pattern="https?://.*"
        />
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Region
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-primary focus:border-primary sm:text-sm appearance-none outline-none"
            >
              <option value="us-east-1">US East (N. Virginia)</option>
              <option value="us-west-1">US West (N. California)</option>
              <option value="eu-west-1">EU (Ireland)</option>
              <option value="ap-south-1">Asia Pacific (Mumbai)</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};
