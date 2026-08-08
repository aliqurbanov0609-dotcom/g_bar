import { useState, useEffect } from 'react';

const FLAVORS = [
  { id: 1, label: 'Манго лимонад', emoji: '🥭' },
  { id: 2, label: 'Кислый цитрус', emoji: '🍋' },
  { id: 3, label: 'Ягодный микс', emoji: '🍓' },
  { id: 4, label: 'Мятная свежесть', emoji: '🌿' },
  { id: 5, label: 'Кокос-тропик', emoji: '🥥' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'non' | 'alc' | 'ex'>('non');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('Ягодный микс');
  const [prompt, setPrompt] = useState('Сладкий ягодный лимонад с клубникой');

  // Ставим твою иконку как favicon сайта
  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = '/icon.png';
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1f2c] text-white flex justify-center p-4 font-sans">
      <div className="w-full max-w-[420px]">
        {/* HEADER */}
        <div className="flex justify-between items-center mt-2 mb-6">
          <div className="flex items-center gap-2 bg-[#1a3246]/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <img src="/icon.png" alt="icon" className="w-5 h-5 rounded-full object-cover" />
            <span className="tracking-[0.2em] text-[13px] font-bold text-white/90">GURBANOV</span>
          </div>
          <button className="bg-[#1a3246] border border-[#ff8a5b]/30 text-[#ff8a5b] px-5 py-2 rounded-full text-sm font-bold tracking-widest">
            EXIT
          </button>
        </div>

        <h1 className="text-[#ff8a5b] font-black text-2xl tracking-wider mb-4 ml-1">AI MIXMASTER</h1>

        {/* CARD */}
        <div className="bg-[#162c3e]/90 rounded-[28px] p-4 border border-white/5 shadow-2xl backdrop-blur">
          {/* TABS */}
          <div className="flex bg-[#0f2232] rounded-full p-1 mb-6">
            <button onClick={() => setActiveTab('non')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all ${activeTab === 'non'? 'bg-[#ff8a5b] text-white shadow-[0_0_15px_rgba(255,138,91,0.5)]' : 'text-white/50'}`}>
              БЕЗАЛКОГО...
            </button>
            <button onClick={() => setActiveTab('alc')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all ${activeTab === 'alc'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>
              АЛКОГОЛЬН...
            </button>
            <button onClick={() => setActiveTab('ex')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all ${activeTab === 'ex'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>
              ЭКСКЛЮЗИВ
            </button>
          </div>

          <p className="text-white/40 text-[15px] mb-4 px-1">Что хочет гость? Выберите вкус или напишите:</p>

          {/* CHIPS */}
          <div className="flex flex-wrap gap-2.5 mb-5">
            {FLAVORS.map(f => (
              <button
                key={f.id}
                onClick={() => { setSelectedFlavor(f.label); setPrompt(`Сладкий ${f.label.toLowerCase()} с клубникой`); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] border transition-all ${selectedFlavor === f.label? 'bg-white text-black border-white' : 'bg-[#1e3a4f] border-white/10 text-white/70'}`}
              >
                <span className="text-[#ff8a5b]">✧</span> {f.emoji} {f.label}
              </button>
            ))}
          </div>

          {/* TEXTAREA */}
          <div className="relative bg-[#0f2232] rounded-[20px] p-4 border border-white/5 mb-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent outline-none resize-none text-[15px] leading-6 min-h-[80px] text-white/90 placeholder:text-white/30"
              placeholder="Напиши что хочет гость..."
            />
            <button className="absolute bottom-3 right-3 w-10 h-10 bg-[#1a3246] rounded-full flex items-center justify-center text-[#ff8a5b]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
            </button>
          </div>

          {/* SHAKE BUTTON */}
          <button onClick={() => alert(`Готовим: ${prompt}`)} className="w-full h-[64px] rounded-full bg-gradient-to-b from-[#5b8def] to-[#2c5ab5] border-[3px] border-[#8bb3ff]/50 shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_10px_30px_rgba(0,0,0,0.5)] relative flex items-center justify-center group active:scale-[0.