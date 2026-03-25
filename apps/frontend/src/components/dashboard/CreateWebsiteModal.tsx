import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '@repo/ui/button';
import { Globe } from '../icons';

interface CreateWebsiteModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; url: string }) => void | Promise<void>;
}

export const CreateWebsiteModal: React.FC<CreateWebsiteModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    setError('');
    setSubmitting(true);
    try {
      await onCreate({ name, url });
      setName('');
      setUrl('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create website');
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
          <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/60 rounded-lg py-2 px-3">
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

