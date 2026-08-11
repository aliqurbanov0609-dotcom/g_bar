import { useState, useEffect } from 'react';

type Screen = 'splash_idle' | 'splash_go' | 'login_idle' | 'login_go' | 'main';

const FLAVORS = [
  { id: 1, label: 'Манго лимонад', emoji: '🥭' },
  { id: 2, label: 'Кислый цитрус', emoji: '🍋' },
  { id: 3, label: 'Ягодный микс', emoji: '🍓' },
  { id: 4, label: 'Мятная свежесть', emoji: '🌿' },
  { id: 5, label: 'Кокос-тропик', emoji: '🥥' },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash_idle');
  const [isZooming, setIsZooming] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState<'non' | 'alc' | 'ex'>('non');

  const CORRECT_PIN = '0609';

  // ПЛАВНЫЙ ZOOM без черного экрана
  const zoomTo = (next: Screen) => {
    setIsZooming(true);
    setTimeout(() => {
      setScreen(next);
      setIsZooming(false);
    }, 550);
  };

  const pressDigit = (d: string) => {
    if (pin.length >= 4) return;
    if ('vibrate' in navigator) navigator.vibrate(20);
    setPin(p => p + d);
  };

  useEffect(() => {
    if (pin.length === 4 && pin!== CORRECT_PIN) {
      setTimeout(() => setPin(''), 600);
    }
  }, [pin]);

  if (screen!== 'main') {
    return (
      <div className="fixed inset-0 bg-black w-screen h-[100dvh] flex justify-center overflow-hidden">
        <div className={`relative w-full h-full max-w-[430px] bg-black transition-transform duration-[600ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${isZooming? 'scale-[1.3]' : 'scale-100'}`}>

          {/* 1. SPLASH */}
          {screen === 'splash_idle' && (
            <>
              <video src="/assets/splash_idle.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
              <button onClick={() => zoomTo('splash_go')} className="absolute bottom-[2%] left-[5%] w-[90%] h-[16%] z-20" />
            </>
          )}
          {screen === 'splash_go' && (
            <video src="/assets/splash_go.mp4" autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" onEnded={() => setScreen('login_idle')} />
          )}

          {/* 2. LOGIN - ТВОЕ ВИДЕО + НЕВИДИМЫЕ КНОПКИ ПОВЕРХ */}
          {screen === 'login_idle' && (
            <>
              <video src="/assets/login_idle.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />

              {/* НЕВИДИМЫЕ КНОПКИ ПОВЕРХ ТВОЕЙ КЛАВИАТУРЫ ИЗ ВИДЕО */}
              <div className="absolute inset-0 z-20">
                {/* Ряд 1 2 3 */}
                <button onClick={() => pressDigit('1')} className="absolute left-[17%] top-[45.5%] w-[20%] h-[8%]" />
                <button onClick={() => pressDigit('2')} className="absolute left-[40%] top-[45.5%] w-[20%] h-[8%]" />
                <button onClick={() => pressDigit('3')} className="absolute left-[63%] top-[45.5%] w-[20%] h-[8%]" />

                {/* Ряд 4 5 6 */}
                <button onClick={() => pressDigit('4')} className="absolute left-[17%] top-[56%] w-[20%] h-[8%]" />
                <button onClick={() => pressDigit('5')} className="absolute left-[40%] top-[56%] w-[20%] h-[8%]" />
                <button onClick={() => pressDigit('6')} className="absolute left-[63%] top-[56%] w-[20%] h-[8%]" />

                {/* Ряд 7 8 9 */}
                <button onClick={() => pressDigit('7')} className="absolute left-[17%] top-[66.5%] w-[20%] h-[8%]" />
                <button onClick={() => pressDigit('8')} className="absolute left-[40%] top-[66.5%] w-[20%] h-[8%]" />
                <button onClick={() => pressDigit('9')} className="absolute left-[63%] top-[66.5%] w-[20%] h-[8%]" />

                {/* 0 и стрелка */}
                <button onClick={() => pressDigit('0')} className="absolute left-[40%] top-[77%] w-[20%] h-[8%]" />
                <button onClick={() => setPin(p => p.slice(0,-1))} className="absolute left-[63%] top-[77%] w-[20%] h-[8%]" />

                {/* Точки пина - показываем поверх видео */}
                <div className="absolute left-0 top-[34%] w-full flex justify-center gap-3 pointer-events-none">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`w-[42px] h-[42px] rounded-full transition-all duration-200 ${i < pin.length? 'bg-[#ffcc66] shadow-[0_0_20px_#ffcc66] scale-110' : 'bg-transparent'}`} />
                  ))}
                </div>

                {/* GO - появляется и пульсирует когда введен 0609 */}
                <button
                  onClick={() => pin === CORRECT_PIN && zoomTo('login_go')}
                  className={`absolute bottom-[5%] left-[5%] w-[90%] h-[10%] rounded-full transition-all duration-500 ${pin === CORRECT_PIN? 'bg-[#ffcc66]/20 shadow-[0_0_40px_rgba(255,204,102,0.9)] animate-pulse scale-[1.02]' : 'bg-transparent'}`}
                />
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

  // MAIN твой G-BAR
  return (
    <div className="min-h-[100dvh] bg-[#0f1f2c] text-white flex justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="flex justify-between items-center mt-2 mb-6">
          <div className="flex items-center gap-2 bg-[#1a3246]/80 px-4 py-2 rounded-full border border-white/10">
            <img src="/icon.png" alt="icon" className="w-5 h-5 rounded-full object-cover" />
            <span className="tracking-[0.2em] text-[13px] font-bold text-white/90">GURBANOV</span>
          </div>
          <button onClick={() => { setPin(''); setScreen('splash_idle'); }} className="bg-[#1a3246] border border-[#ff8a5b]/30 text-[#ff8a5b] px-5 py-2 rounded-full text-sm font-bold">EXIT</button>
        </div>
        <h1 className="text-[#ff8a5b] font-black text-2xl tracking-wider mb-4 ml-1">AI MIXMASTER</h1>
        <div className="bg-[#162c3e]/90 rounded-[28px] p-4 border border-white/5">
          <div className="flex bg-[#0f2232] rounded-full p-1 mb-6">
            <button onClick={() => setActiveTab('non')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${activeTab === 'non'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>БЕЗАЛКОГО...</button>
            <button onClick={() => setActiveTab('alc')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${activeTab === 'alc'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>АЛКОГОЛЬН...</button>
            <button onClick={() => setActiveTab('ex')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${activeTab === 'ex'? 'bg-[#ff8a5b] text-white' : 'text-white/50'}`}>ЭКСКЛЮЗИВ</button>
          </div>
          <p className="text-white/40 text-[15px] mb-4 px-1">Пин: {pin} | Введи 0609</p>
          <div className="flex flex-wrap gap-2.5 mb-5">
            {FLAVORS.map(f => (
              <button key={f.id} onClick={() => {}} className="px-3.5 py-2 rounded-full text-[13px] border bg-[#1e3a4f] border-white/10 text-white/70">{f.emoji} {f.label}</button>
            ))}
          </div>
          <div className="bg-[#0f2232] rounded-[20px] p-4 border border-white/5 mb-6">
            <textarea defaultValue="Сладкий ягодный лимонад" className="w-full bg-transparent outline-none resize-none text-[15px] min-h-[80px] text-white/90" />
          </div>
          <button className="w-full h-[64px] rounded-full bg-gradient-to-b from-[#5b8def] to-[#2c5ab5] border-[3px] border-[#8bb3ff]/50 flex items-center justify-center font-black">ВЗБОЛТАТЬ</button>
        </div>
      </div>
    </div>
  );
}