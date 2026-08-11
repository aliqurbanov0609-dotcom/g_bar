import { useState } from 'react';

const FLAVORS = [
  { id: 1, label: 'Манго лимонад', emoji: '🥭' },
  { id: 2, label: 'Кислый цитрус', emoji: '🍋' },
  { id: 3, label: 'Ягодный микс', emoji: '🍓' },
  { id: 4, label: 'Мятная свежесть', emoji: '🌿' },
  { id: 5, label: 'Кокос-тропик', emoji: '🥥' },
];

type Screen = 'splash_idle' | 'splash_go' | 'login_idle' | 'login_go' | 'main';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash_idle');
  const [activeTab, setActiveTab] = useState<'non' | 'alc' | 'ex'>('non');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('Ягодный микс');
  const [prompt, setPrompt] = useState('Сладкий ягодный лимонад с клубникой');

  if (screen!== 'main') {
    return (
      <div className="fixed inset-0 bg-black w-screen h-screen overflow-hidden flex items-center justify-center">
        {screen === 'splash_idle' && (
          <div className="w-full h-full relative">
            <video src="/assets/splash_idle.mp4" autoPlay loop muted playsInline preload="auto" className="absolute w-full h-full object-cover" />
            <button onClick={() => setScreen('splash_go')} className="absolute inset-0 w-full h-full z-10 flex items-end justify-center pb-[12%]">
              <span className="bg-white/10 backdrop-blur px-10 py-3 rounded-full border border-white/20 text-white font-bold">GO</span>
            </button>
          </div>
        )}
        {screen === 'splash_go' && (
          <video src="/assets/splash_go.mp4" autoPlay muted playsInline preload="auto" className="absolute w-full h-full object-cover" onEnded={() => setScreen('login_idle')} />
        )}
        {screen === 'login_idle' && (
          <div className="w-full h-full relative">
            <video src="/assets/login_idle.mp4" autoPlay loop muted playsInline preload="auto" className="absolute w-full h-full object-cover" />
            <button onClick={() => setScreen('login_go')} className="absolute inset-0 w-full h-full z-10 flex items-end justify-center pb-[12%]">
              <span className="bg-white/10 backdrop-blur px-10 py-3 rounded-full border border-white/20 text-white font-bold">GO</span>
            </button>
          </div>
        )}
        {screen === 'login_go' && (
          <video src="/assets/login_go.mp4" autoPlay muted playsInline preload="auto" className="absolute w-full h-full object-cover" onEnded={() => setScreen('main')} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1f2c] text-white flex justify-center p-4 font-sans">
      <div className="w-full max-w-[420px]">
        <div className="flex justify-between items-center mt-2 mb-6">
          <div className="flex items-center gap-2 bg-[#1a3246]/80 backdrop-blur px-4 py-2 rounded-full border border-white/10">
            <img src="/icon.png" alt="icon" className="w-5 h-5 rounded-full object-cover" />
            <span className="tracking-[0.2em] text-[13px] font-bold text-white/90">GURBANOV</span>
          </div>
          <button onClick={() => setScreen('splash_idle')} className="bg-[#1a3246] border border-[#ff8a5b]/30 text-[#ff8a5b] px-5 py-2 rounded-full text-sm font-bold tracking-widest">EXIT</button>
        </div>
        <h1 className="text-[#ff8a5b] font-black text-2xl tracking-wider mb-4 ml-1">AI MIXMASTER</h1>
        <div className="bg-[#162c3e]/90 rounded-[28px] p-4 border border-white/5 shadow-2xl backdrop-blur">
          <div className="flex bg-[#0f2232] rounded-full p-1 mb-6">
            <button onClick={() => setActiveTab('non')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${activeTab === 'non'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>БЕЗАЛКОГО...</button>
            <button onClick={() => setActiveTab('alc')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${activeTab === 'alc'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>АЛКОГОЛЬН...</button>
            <button onClick={() => setActiveTab('ex')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${activeTab === 'ex'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>ЭКСКЛЮЗИВ</button>
          </div>
          <p className="text-white/40 text-[15px] mb-4 px-1">Что хочет гость? Выберите вкус или напишите:</p>
          <div className="flex flex-wrap gap-2.5 mb-5">
            {FLAVORS.map(f => (
              <button key={f.id} onClick={() => { setSelectedFlavor(f.label); setPrompt(`Сладкий ${f.label.toLowerCase()} с клубникой`); }} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] border ${selectedFlavor === f.label? 'bg-white text-black border-white' : 'bg-[#1e3a4f] border-white/10 text-white/70'}`}>
                {f.emoji} {f.label}
              </button>
            ))}
          </div>
          <div className="relative bg-[#0f2232] rounded-[20px] p-4 border border-white/5 mb-6">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-transparent outline-none resize-none text-[15px] leading-6 min-h-[80px] text-white/90" />
          </div>
          <button onClick={() => alert(`Готовим: ${prompt}`)} className="w-full h-[64px] rounded-full bg-gradient-to-b from-[#5b8def] to-[#2c5ab5] border-[3px] border-[#8bb3ff]/50 flex items-center justify-center font-black tracking-widest">ВЗБОЛТАТЬ</button>
        </div>
      </div>
    </div>
  );
}
