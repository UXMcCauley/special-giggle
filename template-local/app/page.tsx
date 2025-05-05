'use client';
//@ts-ignore
/// <reference lib="es2015" />
import { useEffect, useState } from 'react';
import ChatBox from "../components/ChatBox";

export default function Home() {
  const [personality, setPersonality] = useState("sassy");
  const [identity, setIdentity] = useState<any>(null);

  useEffect(() => {
    import(`./personas/${personality}`).then((mod) => {
      setIdentity(mod.identity);
    });
  }, [personality]);

  return (
      <main className="p-8 space-y-4">
        <h1 className="text-2xl font-bold">
          👋 {identity?.greet() || 'Loading...'}
        </h1>
        {identity && (
            <div className="text-sm text-gray-500">
              <p><strong>Name:</strong> {identity.name}</p>
              <p><strong>Tone:</strong> {identity.tone}</p>
              <p><strong>Traits:</strong> {identity.traits.join(', ')}</p>
            </div>
        )}
        <ChatBox personality={personality} setPersonality={setPersonality} />
      </main>
  );
}