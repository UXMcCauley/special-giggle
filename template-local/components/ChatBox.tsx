'use client';
import { useState } from 'react';

export default ({personality, setPersonality}: { personality: string; setPersonality: (p: string) => void }) => {
    const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [memory, setMemory] = useState<string[]>([]);

  async function sendMessage() {
    if (!input.trim()) return;
    const res = await fetch('/api/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, personality })
    });
    const data = await res.json();
    setReply(data.reply);
    setMemory(data.memory || []);
    setInput('');
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Agent Personality</label>
            <select
                value={personality}
                onChange={(e) => setPersonality(e.target.value.toString())}
                className="p-2 border rounded bg-white text-sm"
            >
                <option value="pragmatist">Pragmatist</option>
                <option value="sassy">Sassy</option>
                <option value="innocent">Innocent</option>
            </select>
        </div>
      <h2 className="text-xl font-bold">💬 Talk to your MCP Agent</h2>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
            }}
            className="space-y-2"
        >
  <textarea
      className="w-full p-2 border rounded bg-gray-100 text-sm"
      rows={3}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type a message..."
  />
            <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded"
            >
                Send
            </button>
        </form>
      {reply && (
        <div className="mt-4 p-3 border rounded bg-white shadow">
          <p className="font-semibold">Agent:</p>
          <p>{reply}</p>
        </div>
      )}

      {memory.length > 0 && (
        <div className="mt-4 p-3 border rounded bg-gray-50 text-sm">
          <p className="font-semibold">🧠 Memory (last 5 messages):</p>
          <ul className="list-disc list-inside">
            {memory.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
