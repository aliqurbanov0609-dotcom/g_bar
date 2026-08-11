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
  const [activeTab, setActiveTab] = useState<'non' | 'alc' | 'ex'>('non');
  const [selectedFlavor, setSelectedFlavor] = useState('Ягодный микс');
  const [prompt, setPrompt] = useState('Сладкий ягодный лимонад с клубникой');
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const CORRECT_PIN = '0609';
  const isPinCorrect = pin === CORRECT_PIN;

  // Плавный переход
  const handleGo = (next: Screen) => {
    setIsZooming(true);
    setTimeout(() => {
      setScreen(next);
      setIsZooming(false);
    }, 600); // 0.6 сек ZOOM
  };

  const handleDigit = (d: string) => {
    if (pin.length >= 4) return;
    setPressedKey(d);
    setTimeout(() => setPressedKey(null), 150);
    // вибрация на телефоне
    if ('vibrate' in navigator) navigator.vibrate(30);
    setPin(p => p + d);
  };

  const handleDelete = () => {
    setPressedKey('del');
    setTimeout(() => setPressedKey(null), 150);
    setPin(p => p.slice(0, -1));
  };

  // Авто-очистка если неверный пин
  useEffect(() => {
    if (pin.length === 4 && pin!== CORRECT_PIN) {
      setTimeout(() => setPin(''), 500);
    }
  }, [pin]);

  if (screen!== 'main') {
    return (
      <div className="fixed inset-0 bg-black w-screen h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className={`relative w-full h-full max-w-[430px] mx-auto bg-black overflow-hidden transition-transform duration-[700ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${isZooming? 'scale-[1.25]' : 'scale-100'}`}>

          {/* 1. SPLASH IDLE */}
          {screen === 'splash_idle' && (
            <>
              <video src="/assets/splash_idle.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
              <button onClick={() => handleGo('splash_go')} className="absolute bottom-0 left-0 w-full h-[30%] z-10" />
            </>
          )}

          {/* 2. SPLASH GO - тряска шейкера */}
          {screen === 'splash_go' && (
            <video src="/assets/splash_go.mp4" autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" onEnded={() => setScreen('login_idle')} />
          )}

          {/* 3. LOGIN IDLE - ПИН КОД с анимацией */}
          {screen === 'login_idle' && (
            <>
              <video src="/assets/login_idle.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40" />

              {/* Оверлей с пином */}
              <div className="absolute inset-0 flex flex-col items-center">
                {/* Лого Eyvan - берем из видео но делаем красивее */}
                <div className="mt-[12%] flex flex-col items-center">
                  <div className="w-20 h-20 text-[#d4a054]"> {/* тут твой лого из видео */} </div>
                  <h2 className="text-[#d4a054] font-serif text-3xl font-bold mt-2">Eyvan</h2>
                  <p className="text-[#d4a054]/60 text-[10px] tracking-[0.3em]">RESTORANI</p>
                </div>

                {/* Точки пина */}
                <div className="flex gap-4 mt-8 mb-6">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`w-5 h-5 rounded-full border transition-all duration-300 ${i < pin.length? 'bg-[#ffcc66] border-[#ffcc66] shadow-[0_0_15px_#ffcc66]' : 'bg-transparent border-[#d4a054]/30'}`} />
                  ))}
                </div>

                {/* Клавиатура */}
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {['1','2','3','4','5','6','7','8','9'].map(n => (
                    <button key={n} onClick={() => handleDigit(n)} className={`w-[72px] h-[48px] rounded-full bg-[#1a1a1a]/80 border border-[#d4a054]/20 text-white text-xl backdrop-blur transition-all ${pressedKey === n? 'scale-90 bg-[#d4a054]/30 border-[#d4a054]' : 'active:scale-95'}`}>{n}</button>
                  ))}
                  <div />
                  <button onClick={() => handleDigit('0')} className={`w-[72px] h-[48px] rounded-full bg-[#1a1a1a]/80 border border-[#d4a054]/20 text-white text-xl backdrop-blur ${pressedKey === '0'? 'scale-90 bg-[#d4a054]/30' : ''}`}>0</button>
                  <button onClick={handleDelete} className={`w-[72px] h-[48px] rounded-full bg-[#1a1a1a]/80 border border-[#d4a054]/20 flex items-center justify-center ${pressedKey === 'del'? 'scale-90' : ''}`}>
                    <span className="text-[#ffcc66] text-2xl">←</span>
                  </button>
                </div>

                {/* Кнопка GO - светится когда пин верный */}
                <button onClick={() => isPinCorrect && handleGo('login_go')} className={`mt-8 w-[85%] h-[56px] rounded-full flex items-center justify-center font-black tracking-widest transition-all duration-500 ${isPinCorrect? 'bg-gradient-to-r from-[#ffcc66] to-[#d4a054] text-black shadow-[0_0_30px_rgba(255,204,102,0.6)] animate-pulse scale-105' : 'bg-white/10 text-white/30 border border-white/10'}`}>
                  GO {isPinCorrect && '→'}
                </button>
              </div>
            </>
          )}

          {screen === 'login_go' && (
            <video src="/assets/login_go.mp4" autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" onEnded={() => setScreen('main')} />
          )}
        </div>
      </div>
    );
  }

  // MAIN
  return (
    <div className="min-h-[100dvh] bg-[#0f1f2c] text-white flex justify-center p-4 animate-[fadeIn_0.8s_ease]">
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
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}