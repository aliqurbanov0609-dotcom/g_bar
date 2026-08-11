import { useState, useRef } from 'react';

type Screen = 'splash' | 'login' | 'main';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {screen === 'splash' && (
        <SplashScreen onNext={() => setScreen('login')} />
      )}

      {screen === 'login' && (
        <LoginScreen onNext={() => setScreen('main')} />
      )}

      {screen === 'main' && <MainScreen />}
    </div>
  );
}

// ---------------- SPLASH ----------------

function SplashScreen({ onNext }: { onNext: () => void }) {
  const [zoom, setZoom] = useState(false);
  const [showGo, setShowGo] = useState(false);
  const goRef = useRef<HTMLVideoElement>(null);

  const start = () => {
    if (zoom) return;

    setZoom(true);

    setTimeout(() => {
      setShowGo(true);
      requestAnimationFrame(() => goRef.current?.play());
    }, 650);
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden ${
        zoom ? 'animate-[zoomSplash_650ms_ease-in-out_forwards]' : ''
      }`}
      onClick={start}
    >
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/splash_idle.mp4"
        autoPlay
        muted
        loop={!showGo}
        playsInline
      />

      {showGo && (
        <video
          ref={goRef}
          className="absolute inset-0 w-full h-full object-cover animate-[fadeIn_250ms_ease-out_forwards]"
          src="/videos/splash_go.mp4"
          muted
          playsInline
          onEnded={onNext}
        />
      )}

      <style>{`
        @keyframes zoomSplash {
          from { transform: scale(1); }
          to { transform: scale(1.2); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ---------------- LOGIN ----------------

function LoginScreen({ onNext }: { onNext: () => void }) {
  const [pin, setPin] = useState('');
  const [zoom, setZoom] = useState(false);
  const [showGo, setShowGo] = useState(false);

  const goRef = useRef<HTMLVideoElement>(null);

  const press = (n: string) => {
    if (pin.length < 4) setPin(pin + n);
  };

  const remove = () => setPin(pin.slice(0, -1));

  const submit = () => {
    if (pin !== '0609') return;

    setZoom(true);

    setTimeout(() => {
      setShowGo(true);
      requestAnimationFrame(() => goRef.current?.play());
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden ${
        zoom ? 'animate-[zoomLogin_500ms_ease-in-out_forwards]' : ''
      }`}
    >
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/login_idle.mp4"
        autoPlay
        muted
        loop={!showGo}
        playsInline
      />

      {showGo && (
        <video
          ref={goRef}
          className="absolute inset-0 w-full h-full object-cover animate-[fadeIn_250ms_ease-out_forwards]"
          src="/videos/login_go.mp4"
          muted
          playsInline
          onEnded={onNext}
        />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-8">
        {/* dots */}
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                pin.length > i
                  ? 'bg-orange-500 border-orange-400 scale-110 shadow-[0_0_20px_rgba(255,115,0,0.9)]'
                  : 'bg-white/10 border-white/20'
              }`}
            />
          ))}
        </div>

        {/* keypad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[320px]">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button
              key={n}
              onClick={() => press(String(n))}
              className="h-16 rounded-2xl bg-[#0B1B2C]/80 text-white text-2xl font-bold backdrop-blur-md border border-white/10 active:scale-95 transition-all"
            >
              {n}
            </button>
          ))}

          <div />

          <button
            onClick={() => press('0')}
            className="h-16 rounded-2xl bg-[#0B1B2C]/80 text-white text-2xl font-bold backdrop-blur-md border border-white/10 active:scale-95 transition-all"
          >
            0
          </button>

          <button
            onClick={remove}
            className="h-16 rounded-2xl bg-[#0B1B2C]/80 text-white text-xl font-bold backdrop-blur-md border border-white/10 active:scale-95 transition-all"
          >
            ⌫
          </button>
        </div>

        {/* GO */}
        <button
          onClick={submit}
          disabled={pin !== '0609'}
          className={`w-full max-w-[320px] h-14 mt-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
            pin === '0609'
              ? 'bg-orange-500 text-white animate-[pulseGo_1.2s_ease-in-out_infinite]'
              : 'bg-white/10 text-white/40'
          }`}
        >
          GO
        </button>
      </div>

      <style>{`
        @keyframes zoomLogin {
          from { transform: scale(1); }
          to { transform: scale(1.12); }
        }

        @keyframes pulseGo {
          0% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(255,115,0,.5);
          }

          50% {
            transform: scale(1.04);
            box-shadow:
              0 0 24px rgba(255,115,0,1),
              0 0 48px rgba(29,139,255,.8);
          }

          100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(255,115,0,.5);
          }
        }
      `}</style>
    </div>
  );
}

// ---------------- MAIN ----------------

function MainScreen() {
  return (
    <div className="fixed inset-0 bg-[#07111E] flex items-center justify-center">
      <div className="animate-[logoZoom_450ms_ease-out_forwards]">
        <div className="w-32 h-32 rounded-full bg-[#13263A] border border-[#1D8BFF]/40 flex items-center justify-center shadow-[0_0_40px_rgba(29,139,255,.4)]">
          <span className="text-5xl font-black text-orange-500">G</span>
        </div>
      </div>

      <style>{`
        @keyframes logoZoom {
          from {
            transform: scale(1);
            opacity: 1;
          }

          to {
            transform: scale(1.25);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}