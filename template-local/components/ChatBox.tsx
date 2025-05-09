'use client';
import { useState, useEffect, useRef } from 'react';

export default ({personality, setPersonality}: { personality: string; setPersonality: (p: string) => void }) => {
    const [input, setInput] = useState('');
    const [reply, setReply] = useState('');
    const [memory, setMemory] = useState<string[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string>('');
    const recognitionRef = useRef<any>(null);

    // Initialize speech recognition
    useEffect(() => {
        // Check if browser supports SpeechRecognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result) => result.transcript)
                    .join('');

                setInput(transcript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        // Get available audio input devices
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    const audioInputs = devices.filter(device => device.kind === 'audioinput');
                    setAvailableDevices(audioInputs);
                    if (audioInputs.length > 0) {
                        setSelectedDevice(audioInputs[0].deviceId);
                    }
                })
                .catch(err => {
                    console.error('Error enumerating devices', err);
                });
        }
    }, []);

    // Toggle speech recognition
    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.start();
                setIsListening(true);
            }
        }
    };

    // Change audio input device
    const changeDevice = (deviceId: string) => {
        setSelectedDevice(deviceId);
        if (isListening) {
            recognitionRef.current?.stop();
            recognitionRef.current?.start();
        }
    };

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

        // Stop listening after sending a message
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }
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

        {/* Audio Device Selection */}
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Audio Input Device</label>
            <select
                value={selectedDevice}
                onChange={(e) => changeDevice(e.target.value)}
                className="p-2 border rounded bg-white text-sm"
                disabled={availableDevices.length === 0}
            >
                {availableDevices.length === 0 ? (
                    <option value="">No devices available</option>
                ) : (
                    availableDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Microphone ${device.deviceId.substring(0, 5)}...`}
                        </option>
                    ))
                )}
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
            <div className="relative">
                <textarea
                    className={`w-full p-2 border rounded ${isListening ? 'bg-red-50' : 'bg-gray-100'} text-sm`}
                    rows={3}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Listening... Speak now" : "Type a message or click the microphone to speak..."}
                />
                <button
                    type="button"
                    onClick={toggleListening}
                    className={`absolute right-2 bottom-2 p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                    title={isListening ? "Stop listening" : "Start listening"}
                >
                    {isListening ? '🛑' : '🎤'}
                </button>
            </div>

            <div className="flex space-x-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded flex-grow"
                >
                    Send
                </button>
                <button
                    type="button"
                    onClick={() => setInput('')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                    title="Clear input"
                >
                    Clear
                </button>
            </div>
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
