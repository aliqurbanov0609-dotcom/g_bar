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
      <div className="fixed inset-0 bg-black w-screen h-[100dvh] flex items-center justify-center">
        {/* Центрируем как телефон */}
        <div className="relative w-full max-w-[430px] h-full max-h-[900px] mx-auto bg-black overflow-hidden">
          {screen === 'splash_idle' && (
            <>
              <video src="/assets/splash_idle.mp4" autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-contain" />
              <button onClick={() => setScreen('splash_go')} className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[75%] h-[70px] z-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                <span className="text-white font-black tracking-widest">GO</span>
              </button>
            </>
          )}
          {screen === 'splash_go' && (
            <video src="/assets/splash_go.mp4" autoPlay muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-contain" onEnded={() => setScreen('login_idle')} />
          )}
          {screen === 'login_idle' && (
            <>
              <video src="/assets/login_idle.mp4" autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-contain" />
              <button onClick={() => setScreen('login_go')} className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[75%] h-[70px] z-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                <span className="text-white font-black tracking-widest">GO</span>
              </button>
            </>
          )}
          {screen === 'login_go' && (
            <video src="/assets/login_go.mp4" autoPlay muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-contain" onEnded={() => setScreen('main')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#0f1f2c] text-white flex justify-center p-3 font-sans overflow-hidden">
      <div className="w-full max-w-[400px] flex flex-col">
        <div className="flex justify-between items-center mt-2 mb-4">
          <div className="flex items-center gap-2 bg-[#1a3246]/80 backdrop-blur px-4 py-2 rounded-full border border-white/10">
            <img src="/icon.png" alt="icon" className="w-5 h-5 rounded-full object-cover" />
            <span className="tracking-[0.2em] text-[12px] font-bold text-white/90">GURBANOV</span>
          </div>
          <button onClick={() => setScreen('splash_idle')} className="bg-[#1a3246] border border-[#ff8a5b]/30 text-[#ff8a5b] px-4 py-1.5 rounded-full text-[12px] font-bold tracking-widest">EXIT</button>
        </div>

        <h1 className="text-[#ff8a5b] font-black text-xl tracking-wider mb-3 ml-1">AI MIXMASTER</h1>

        <div className="bg-[#162c3e]/90 rounded-[24px] p-3.5 border border-white/5 shadow-2xl backdrop-blur flex-1">
          <div className="flex bg-[#0f2232] rounded-full p-1 mb-4">
            <button onClick={() => setActiveTab('non')} className={`flex-1 py-2 rounded-full text-[11px] font-bold ${activeTab === 'non'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>БЕЗАЛКОГО...</button>
            <button onClick={() => setActiveTab('alc')} className={`flex-1 py-2 rounded-full text-[11px] font-bold ${activeTab === 'alc'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>АЛКОГОЛЬН...</button>
            <button onClick={() => setActiveTab('ex')} className={`flex-1 py-2 rounded-full text-[11px] font-bold ${activeTab === 'ex'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>ЭКСКЛЮЗИВ</button>
          </div>

          <p className="text-white/40 text-[13px] mb-3 px-1">Что хочет гость?</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {FLAVORS.map(f => (
              <button key={f.id} onClick={() => { setSelectedFlavor(f.label); setPrompt(`Сладкий ${f.label.toLowerCase()} с клубникой`); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] border ${selectedFlavor === f.label? 'bg-white text-black border-white' : 'bg-[#1e3a4f] border-white/10 text-white/70'}`}>
                {f.emoji} {f.label}
              </button>
            ))}
          </div>

          <div className="bg-[#0f2232] rounded-[16px] p-3 border border-white/5 mb-4">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-transparent outline-none resize-none text-[13px] leading-5 min-h-[60px] text-white/90" />
          </div>

          <button onClick={() => alert(`Готовим: ${prompt}`)} className="w-full h-[56px] rounded-full bg-gradient-to-b from-[#5b8def] to-[#2c5ab5] border-[2px] border-[#8bb3ff]/50 flex items-center justify-center font-black tracking-widest text-sm">ВЗБОЛТАТЬ</button>
        </div>
      </div>
    </div>
  );
}
