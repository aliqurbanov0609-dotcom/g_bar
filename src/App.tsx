import { useState, useEffect } from 'react';

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
  const [isZooming, setIsZooming] = useState(false);
  const [pin, setPin] = useState('');
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'non' | 'alc' | 'ex'>('non');
  const [selectedFlavor, setSelectedFlavor] = useState('Ягодный микс');
  const [prompt, setPrompt] = useState('Сладкий ягодный лимонад с клубникой');

  const CORRECT_PIN = '0609';
  const isPinCorrect = pin === CORRECT_PIN;

  const handleGo = (next: Screen) => {
    setIsZooming(true);
    setTimeout(() => {
      setScreen(next);
      setIsZooming(false);
    }, 600);
  };

  const handleDigit = (d: string) => {
    if (pin.length >= 4) return;
    setPressedKey(d);
    setTimeout(() => setPressedKey(null), 120);
    if ('vibrate' in navigator) navigator.vibrate(20);
    setPin(p => p + d);
  };

  const handleDelete = () => {
    setPressedKey('del');
    setTimeout(() => setPressedKey(null), 120);
    setPin(p => p.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === 4 && pin!== CORRECT_PIN) {
      setTimeout(() => setPin(''), 400);
    }
  }, [pin]);

  if (screen!== 'main') {
    return (
      <div className="fixed inset-0 bg-black w-screen h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className={`relative w-full h-full max-w-[430px] mx-auto bg-black overflow-hidden transition-transform duration-700 ease-in-out ${isZooming? 'scale-[1.25]' : 'scale-100'}`}>

          {screen === 'splash_idle' && (
            <>
              <video src="/assets/splash_idle.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
              <button onClick={() => handleGo('splash_go')} className="absolute bottom-0 left-0 w-full h-[35%] z-10" />
            </>
          )}

          {screen === 'splash_go' && (
            <video src="/assets/splash_go.mp4" autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" onEnded={() => setScreen('login_idle')} />
          )}

          {screen === 'login_idle' && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-between py-8">
              {/* ЛОГОТИП - чистый, без видео */}
              <div className="flex flex-col items-center mt-6">
                <div className="w-24 h-24 relative">
                  {/* Используем твой логотип из видео как картинку - пока поставлю эмодзи, заменишь на img */}
                  <div className="w-full h-full flex items-center justify-center text-[#d4a054]">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 fill-[#d4a054]"><path d="M50 10 C55 25 75 30 85 20 C80 35 90 55 75 60 C85 70 70 85 50 75 C30 85 15 70 25 60 C10 55 20 35 15 20 C25 30 45 25 50 10 Z" /></svg>
                  </div>
                </div>
                <h1 className="text-[#d4a054] font-serif text-[36px] font-bold leading-none mt-2">Eyvan</h1>
                <p className="text-[#d4a054]/60 text-[11px] tracking-[0.4em] mt-1">RESTORANI</p>
              </div>

              {/* Точки */}
              <div className="flex gap-5 mt-4">
                {[0,1,2,3].map(i => (
                  <div key={i} className={`w-[44px] h-[44px] rounded-full flex items-center justify-center border-2 transition-all duration-300 ${i < pin.length? 'bg-[#d4a054] border-[#d4a054] shadow-[0_0_20px_rgba(212,160,84,0.8)] scale-110' : 'border-[#d4a054]/30 bg-[#111]'}`}>
                    {i < pin.length && <div className="w-3 h-3 bg-black/30 rounded-full" />}
                  </div>
                ))}
              </div>

              {/* Клавиатура - теперь одна, красивая */}
              <div className="grid grid-cols-3 gap-4 px-6">
                {['1','2','3','4','5','6','7','8','9'].map(n => (
                  <button key={n} onPointerDown={() => handleDigit(n)} className={`w-[84px] h-[56px] rounded-full bg-[#1e1e1e] border border-[#d4a054]/20 text-white text-[22px] font-medium transition-all duration-100 ${pressedKey === n? 'scale-90 bg-[#d4a054] text-black' : 'active:scale-95'}`}>{n}</button>
                ))}
                <div />
                <button onPointerDown={() => handleDigit('0')} className={`w-[84px] h-[56px] rounded-full bg-[#1e1e1e] border border-[#d4a054]/20 text-white text-[22px] transition-all ${pressedKey === '0'? 'scale-90 bg-[#d4a054] text-black' : ''}`}>0</button>
                <button onPointerDown={handleDelete} className={`w-[84px] h-[56px] rounded-full bg-[#1e1e1e] border border-[#d4a054]/20 flex items-center justify-center ${pressedKey === 'del'? 'scale-90' : ''}`}>
                  <span className="text-[#d4a054] text-2xl">←</span>
                </button>
              </div>

              {/* GO */}
              <button onClick={() => isPinCorrect && handleGo('login_go')} disabled={!isPinCorrect} className={`w-[90%] h-[64px] rounded-full font-black tracking-[0.2em] text-[18px] transition-all duration-500 ${isPinCorrect? 'bg-gradient-to-r from-[#ffde8a] to-[#d4a054] text-black shadow-[0_0_40px_rgba(212,160,84,0.7)] animate-[pulse_1.2s_infinite] scale-105' : 'bg-[#1e1e1e] text-white/20 border border-white/5'}`}>
                GO
              </button>
              <div className="h-2" />
            </div>
          )}

          {screen === 'login_go' && (
            <video src="/assets/login_go.mp4" autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" onEnded={() => setScreen('main')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#0f1f2c] text-white flex justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="flex justify-between items-center mt-2 mb-6">
          <div className="flex items-center gap-2 bg-[#1a3246]/80 px-4 py-2 rounded-full border border-white/10">
            <img src="/icon.png" className="w-5 h-5 rounded-full" />
            <span className="tracking-[0.2em] text-[13px] font-bold">GURBANOV</span>
          </div>
          <button onClick={() => setScreen('splash_idle')} className="bg-[#1a3246] border border-[#ff8a5b]/30 text-[#ff8a5b] px-5 py-2 rounded-full text-sm font-bold">EXIT</button>
        </div>
        <h1 className="text-[#ff8a5b] font-black text-2xl mb-4 ml-1">AI MIXMASTER</h1>
        <div className="bg-[#162c3e]/90 rounded-[28px] p-4 border border-white/5">
          <div className="flex bg-[#0f2232] rounded-full p-1 mb-6">
            <button onClick={() => setActiveTab('non')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${activeTab === 'non'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>БЕЗАЛКОГО...</button>
            <button onClick={() => setActiveTab('alc')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${activeTab === 'alc'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>АЛКОГОЛЬН...</button>
            <button onClick={() => setActiveTab('ex')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${activeTab === 'ex'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>ЭКСКЛЮЗИВ</button>
          </div>
          <div className="flex flex-wrap gap-2.5 mb-5">
            {FLAVORS.map(f => (
              <button key={f.id} onClick={() => { setSelectedFlavor(f.label); setPrompt(`Сладкий ${f.label.toLowerCase()} с клубникой`); }} className={`px-3.5 py-2 rounded-full text-[13px] border ${selectedFlavor === f.label? 'bg-white text-black' : 'bg-[#1e3a4f] border-white/10 text-white/70'}`}>{f.emoji} {f.label}</button>
            ))}
          </div>
          <div className="bg-[#0f2232] rounded-[20px] p-4 border border-white/5 mb-6">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-transparent outline-none resize-none text-[15px] min-h-[80px] text-white/90" />
          </div>
          <button onClick={() => alert(`Готовим: ${prompt}`)} className="w-full h-[64px] rounded-full bg-gradient-to-b from-[#5b8def] to-[#2c5ab5] border-[3px] border-[#8bb3ff]/50 flex items-center justify-center font-black">ВЗБОЛТАТЬ</button>
        </div>
      </div>
    </div>
  );
}