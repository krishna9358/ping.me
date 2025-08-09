import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { MessageCircle, X } from 'lucide-react';

export const Assistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hi! How can I help you with ping.me today?' },
  ]);
  const [loading, setLoading] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const userMsg = { role: 'user' as const, content: query };
    setMessages((m) => [...m, userMsg]);
    setQuery('');
    setLoading(true);
    try {
      // Placeholder AI: echo with helpful hint. Integrate real API later.
      await new Promise((r) => setTimeout(r, 500));
      const reply = {
        role: 'assistant' as const,
        content: `I understand: "${userMsg.content}". You can manage websites from the Dashboard, use Create Website to add a new URL, and open details to view uptime and screenshots.`,
      };
      setMessages((m) => [...m, reply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="primary"
          size="lg"
          className="rounded-full shadow-xl shadow-accent-500/20"
          onClick={() => setOpen(true)}
          icon={MessageCircle as any}
        >
          Ask AI
        </Button>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="AI Assistant"
        description="Ask anything about your monitors, uptime, response times, or how to use ping.me."
        size="lg"
      >
        <div className="flex flex-col space-y-4">
          <div className="h-64 overflow-y-auto rounded-lg border border-gray-700 p-3 bg-gray-900">
            {messages.map((m, i) => (
              <div key={i} className={`mb-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    m.role === 'user'
                      ? 'bg-accent-500 text-white'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex items-center space-x-2">
            <input
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:border-accent-500 focus:ring-0"
              placeholder="Ask a question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Thinking…' : 'Send'}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};


