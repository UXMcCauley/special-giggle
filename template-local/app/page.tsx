'use client';
//@ts-ignore
/// <reference lib="es2015" />
import { useEffect, useState } from 'react';
import ChatBox from "../components/ChatBox";

export default function Home() {
  const [personality, setPersonality] = useState("sassy");
  const [identity, setIdentity] = useState<any>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSpeechSupported(true);
    }

    // Load the selected personality
    import(`./personas/${personality}`).then((mod) => {
      setIdentity(mod.identity);
    });
  }, [personality]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">MCP Agent Testing Interface</h1>
          <p className="text-sm opacity-75">Test your agent with text and voice input</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left sidebar with agent info */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white text-xl">
                  {identity?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{identity?.name || 'Loading...'}</h2>
                  <p className="text-sm text-gray-500">AI Assistant</p>
                </div>
              </div>

              {identity && (
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-medium">Greeting:</span> {identity.greet()}</p>
                  <p><span className="font-medium">Tone:</span> {identity.tone}</p>
                  <p><span className="font-medium">Traits:</span> {identity.traits.join(', ')}</p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="font-medium mb-2">Device & Voice Input</h3>
                {isSpeechSupported ? (
                  <div className="text-sm text-green-600">
                    <p>✅ Speech recognition is supported in your browser</p>
                    <p className="mt-2 text-gray-600">Click the microphone icon in the chat to start speaking</p>
                  </div>
                ) : (
                  <div className="text-sm text-red-600">
                    <p>❌ Speech recognition is not supported in your browser</p>
                    <p className="mt-2 text-gray-600">Try using Chrome, Edge, or Safari for voice input</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main chat area */}
          <div className="md:col-span-2">
            <ChatBox personality={personality} setPersonality={setPersonality} />
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-500 mt-8">
        <p>MCP Agent Testing Interface - Built with Next.js</p>
      </footer>
    </div>
  );
}
