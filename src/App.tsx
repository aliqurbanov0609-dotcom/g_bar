import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setOutput(response.text || '');
    } catch (e) {
      console.error(e);
      setOutput('Error generating content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">My Google AI Studio App</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
        {output && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg whitespace-pre-wrap">
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
