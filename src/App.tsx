import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Bell, Home, Settings, Search, Plus, Trash2, 
  Wine, Droplet, Leaf, Beaker, Zap, Check, Image as ImageIcon,
  Mic, Activity, User, Star, Delete, Lock, LogOut, ChevronRight, Sparkles, ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// --- API Configuration ---
const apiKey = ""; // Заполняется средой выполнения

// --- Helper: Exponential Backoff for APIs ---
const fetchWithRetry = async (url: string, options: any, retries = 5) => {
  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delays[i]));
    }
  }
};

// --- API Functions ---
const generateRecipe = async (prompt: string, inventory: any[], mode: string, language: string) => {
  if (!apiKey) return mockRecipe(mode);

  const inventoryList = inventory.map(item => `${item.name} (${item.category})`).join(', ');
  
  let modeInstruction = "";
  if (mode === 'non-alcoholic') {
    modeInstruction = "Режим: Безалкогольный лимонад. Используй ТОЛЬКО газировку Bonaqua в качестве основы для разбавления, а также сиропы, пюре, фрукты, мяту и лед. Никакого алкоголя или других газировок.";
  } else if (mode === 'alcoholic') {
    modeInstruction = "Режим: Алкогольный лимонад. Обязательно добавь алкоголь (водку или пиво) из инвентаря, а в качестве газировки используй Bonaqua.";
  } else if (mode === 'exclusive') {
    modeInstruction = "Режим: Эксклюзивный лимонад. Можно использовать другие газировки (RedBull, CocaCola, Sprite и т.д.), свежевыжатые соки или RedBull вместо обычной воды.";
  }

  const langInstruction = language === 'az' ? 'ОТВЕЧАЙ СТРОГО НА АЗЕРБАЙДЖАНСКОМ ЯЗЫКЕ.' : 'ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ.';

  const systemPrompt = `
    Ты профессиональный шеф-бармен. Твоя задача - создать идеальный лимонад на основе запроса пользователя, используя доступный инвентарь.
    ${modeInstruction}
    ${langInstruction}
    
    Доступный инвентарь: ${inventoryList}
    Запрос пользователя: "${prompt}"
    
    ОТВЕТ ДОЛЖЕН БЫТЬ СТРОГО В ФОРМАТЕ JSON:
    {
      "name": "Креативное название лимонада",
      "glass": "Тип бокала",
      "garnish": "Украшение",
      "ingredients": [{"name": "Название", "amount": "Количество (напр. 50 мл)"}],
      "steps": ["Шаг 1", "Шаг 2", "Шаг 3"]
    }
  `;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: "Сгенерируй рецепт" }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { responseMimeType: "application/json" }
  };

  const result = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw new Error("Invalid recipe format returned by AI.");
  }
};

const generateImage = async (recipe: any) => {
  if (!apiKey) return "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80";

  const prompt = `Professional macro photography of a stunning refreshing lemonade named "${recipe.name}" in a ${recipe.glass} glass. Garnished with ${recipe.garnish}. Dark moody background, cinematic lighting, neon orange and teal color grading, highly detailed, photorealistic.`;
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
  const payload = {
    instances: { prompt: prompt },
    parameters: { sampleCount: 1 }
  };

  const result = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const base64 = result.predictions?.[0]?.bytesBase64Encoded;
  if (!base64) throw new Error("Image generation failed");
  return `data:image/png;base64,${base64}`;
};

const mockRecipe = (mode: string) => ({
  name: mode === 'alcoholic' ? "Крепкий Манго-Бриз" : "Фирменный Манго Лимонад",
  glass: "Хайбол",
  garnish: "Мята и долька лайма",
  ingredients: [
    { name: "Mango", amount: "30 мл" },
    { name: "Bonaqua", amount: "200 мл" },
    { name: "Лёд", amount: "50 г" }
  ],
  steps: ["Наполните бокал льдом.", "Добавьте сироп манго.", "Залейте газировкой Bonaqua и перемешайте.", "Украсьте мятой."]
});


// --- Reusable UI Components ---

const NeonLogo = ({ onClick, size = 'large', isShaking = false }: { onClick?: () => void, size?: 'large' | 'small', isShaking?: boolean }) => {
  const containerClasses = size === 'large' 
    ? 'w-48 h-48 rounded-[40px]' 
    : 'w-24 h-24 rounded-2xl';
  
  return (
    <div 
      onClick={onClick}
      className={`${containerClasses} flex flex-col items-center justify-center cursor-pointer transition-transform relative overflow-hidden ${isShaking ? 'animate-[wiggle_0.2s_ease-in-out_infinite]' : 'hover:scale-105 active:scale-95'}`}
      style={{
        background: 'linear-gradient(145deg, #182833, #121d26)',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.6), -10px -10px 20px rgba(255,255,255,0.03), inset 2px 2px 5px rgba(255,255,255,0.05), inset -2px -2px 6px rgba(0,0,0,0.6)',
        border: '2px solid rgba(59, 117, 245, 0.3)'
      }}
    >
      <div className="absolute inset-0 bg-[#3B75F5] opacity-10 blur-xl rounded-full pointer-events-none" />

      <div className="relative z-10 text-center px-2">
        <span 
          className="font-black tracking-wider block uppercase"
          style={{
            fontSize: size === 'large' ? '22px' : '11px',
            color: '#fff',
            textShadow: '0 0 10px rgba(59, 117, 245, 0.8), 0 0 20px rgba(59, 117, 245, 0.6), 0 0 30px rgba(59, 117, 245, 0.4)',
            letterSpacing: '2px'
          }}
        >
          MIXMASTER
        </span>
      </div>
    </div>
  );
};

const ShakeButton = ({ onClick, disabled, loading, isShaking }: { onClick: () => void, disabled: boolean, loading: boolean, isShaking: boolean }) => {
  const { t } = useTranslation();
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-full relative py-4 px-6 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer select-none group ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${isShaking ? 'animate-[wiggle_0.15s_ease-in-out_infinite]' : ''}`}
      style={{
        background: 'linear-gradient(180deg, #3895e6 0%, #1754a6 50%, #0d3b75 100%)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -4px 6px rgba(0,0,0,0.5)',
        border: '2px solid #a3d4ff'
      }}
    >
      <div className="absolute inset-x-4 -top-2 -bottom-2 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-32 h-12 bg-white/90 rounded-full blur-[2px] opacity-90 shadow-[0_0_10px_rgba(255,255,255,0.8)] transform scale-x-125" />
        <div className="absolute w-24 h-10 bg-gradient-to-r from-orange-500 via-yellow-400 to-red-500 rounded-full blur-[1px] opacity-80 transform -rotate-3 scale-90" />
      </div>

      <div className="relative z-10 flex items-center gap-2">
        {loading ? (
          <span className="flex items-center gap-2 text-white font-black italic tracking-widest text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-pulse">
            <Zap size={20} className="text-yellow-300" /> {t('mixer.shaking')}
          </span>
        ) : (
          <span 
            className="font-black italic tracking-wider uppercase text-3xl"
            style={{
              background: 'linear-gradient(180deg, #fff700 0%, #ff8c00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(2px 3px 0px #0b2247) drop-shadow(-1px -1px 0px #0b2247) drop-shadow(0 4px 6px rgba(0,0,0,0.8))',
              letterSpacing: '3px'
            }}
          >
            {t('mixer.shake')}
          </span>
        )}
      </div>
    </button>
  );
};


// --- Main Application Component ---
export default function App() {
  const { t, i18n } = useTranslation();
  const [appState, setAppState] = useState('splash'); // 'splash', 'login', 'main'
  const [activeTab, setActiveTab] = useState('mixer'); // 'mixer', 'bar', 'favorites'
  const [favorites, setFavorites] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null); // '0609' (GURBANOV), '1234' (AĠA)
  
  const [inventory, setInventory] = useState([
    { id: 1, name: 'RedBull', category: 'Газировки', image: null },
    { id: 2, name: 'CocaCola', category: 'Газировки', image: null },
    { id: 3, name: 'Fanta', category: 'Газировки', image: null },
    { id: 4, name: 'Sprite', category: 'Газировки', image: null },
    { id: 5, name: 'FuseTea', category: 'Газировки', image: null },
    { id: 6, name: 'Bonaqua', category: 'Газировки', image: null },

    { id: 7, name: 'Зеленое яблоко', category: 'Сиропы', image: null },
    { id: 8, name: 'Банан', category: 'Сиропы', image: null },
    { id: 9, name: 'Груша', category: 'Сиропы', image: null },
    { id: 10, name: 'Блю Кюрасао', category: 'Сиропы', image: null },
    { id: 11, name: 'Имбирь', category: 'Сиропы', image: null },
    { id: 12, name: 'Корица', category: 'Сиропы', image: null },
    { id: 13, name: 'Арбуз', category: 'Сиропы', image: null },
    { id: 14, name: 'Бабл Гам', category: 'Сиропы', image: null },
    { id: 15, name: 'Лайм', category: 'Сиропы', image: null },
    { id: 16, name: 'Розовый грейпфрут', category: 'Сиропы', image: null },
    { id: 17, name: 'Гренадин', category: 'Сиропы', image: null },
    { id: 18, name: 'Апельсин', category: 'Сиропы', image: null },
    { id: 19, name: 'Кокос', category: 'Сиропы', image: null },
    { id: 20, name: 'Мята Мохито', category: 'Сиропы', image: null },
    { id: 21, name: 'Клубника', category: 'Сиропы', image: null },
    { id: 22, name: 'Киви', category: 'Сиропы', image: null },
    { id: 23, name: 'Дыня', category: 'Сиропы', image: null },
    { id: 24, name: 'Гуарана', category: 'Сиропы', image: null },
    { id: 25, name: 'Манго', category: 'Сиропы', image: null },
    { id: 26, name: 'Кардамон', category: 'Сиропы', image: null },
    { id: 27, name: 'Шоколадное печенье', category: 'Сиропы', image: null },
    { id: 28, name: 'Персик', category: 'Сиропы', image: null },
    { id: 29, name: 'Коньяк', category: 'Сиропы', image: null },
    { id: 30, name: 'Алоэ Вера', category: 'Сиропы', image: null },

    { id: 31, name: 'Клубничное пюре', category: 'Пюре и Топпинги', image: null },
    { id: 32, name: 'Маракуйя (с косточками)', category: 'Пюре и Топпинги', image: null },
    { id: 33, name: 'Черная смородина', category: 'Пюре и Топпинги', image: null },
    { id: 34, name: 'Грушевое пюре', category: 'Пюре и Топпинги', image: null },
    { id: 35, name: 'Шоколадный', category: 'Пюре и Топпинги', image: null },
    { id: 36, name: 'Клубничный', category: 'Пюре и Топпинги', image: null },
    { id: 37, name: 'Карамельный', category: 'Пюре и Топпинги', image: null },

    { id: 38, name: 'Маракуйя', category: 'Bobas', image: null },
    { id: 39, name: 'Ореховая Паста', category: 'Bobas', image: null },

    { id: 40, name: 'Пиво', category: 'Алкоголь', image: null },
    { id: 41, name: 'Водка', category: 'Алкоголь', image: null },

    { id: 42, name: 'Лимон', category: 'Фрукты и Лёд', image: null },
    { id: 43, name: 'Яблоко', category: 'Фрукты и Лёд', image: null },
    { id: 44, name: 'Апельсин', category: 'Фрукты и Лёд', image: null },
    { id: 45, name: 'Грейпфрут', category: 'Фрукты и Лёд', image: null },
    { id: 46, name: 'Мята', category: 'Фрукты и Лёд', image: null },
    { id: 47, name: 'Лёд', category: 'Фрукты и Лёд', image: null },
  ]);

  return (
    <div className="min-h-screen bg-[#15232d] text-[#e0e5e9] font-sans selection:bg-[#E87A4A] selection:text-white flex justify-center">
      <style>{`
        @keyframes wiggle {
          0% { transform: rotate(0deg) scale(1); }
          20% { transform: rotate(-5deg) scale(1.03); }
          40% { transform: rotate(5deg) scale(1.03); }
          60% { transform: rotate(-5deg) scale(1.03); }
          80% { transform: rotate(5deg) scale(1.03); }
          100% { transform: rotate(0deg) scale(1); }
        }

        .app-container {
          background: linear-gradient(145deg, #182833, #131f28);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }
        
        .neo-out {
          background: #16252f;
          box-shadow: 5px 5px 12px rgba(0,0,0,0.4), 
                     -5px -5px 12px rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.02);
        }
        
        .neo-in {
          background: #14222b;
          box-shadow: inset 4px 4px 10px rgba(0,0,0,0.5), 
                      inset -4px -4px 10px rgba(255,255,255,0.02);
          border: 1px solid rgba(0,0,0,0.2);
        }

        .neo-active {
          background: #1e3342;
          box-shadow: inset 4px 4px 12px rgba(0,0,0,0.7), 
                      inset -4px -4px 12px rgba(255,255,255,0.05);
          border: 1px solid rgba(232, 122, 74, 0.4);
        }
        
        .neo-btn {
          background: #16252f;
          box-shadow: 4px 4px 8px rgba(0,0,0,0.4), 
                     -4px -4px 8px rgba(255,255,255,0.04);
          transition: all 0.2s ease;
        }
        
        .neo-btn:active {
          box-shadow: inset 3px 3px 6px rgba(0,0,0,0.4), 
                      inset -3px -3px 6px rgba(255,255,255,0.02);
          transform: translateY(1px);
        }

        .convex-btn {
          background: linear-gradient(145deg, #1a2d3b, #121e27);
          box-shadow: 4px 4px 10px rgba(0,0,0,0.5), 
                     -3px -3px 8px rgba(255,255,255,0.05),
                     inset 1px 1px 2px rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.04);
          transition: all 0.2s ease;
        }
        .convex-btn:active {
          box-shadow: 2px 2px 5px rgba(0,0,0,0.6), 
                     -1px -1px 3px rgba(255,255,255,0.02),
                     inset 2px 2px 4px rgba(0,0,0,0.4);
          transform: translateY(1px);
        }

        .text-neon-orange {
          color: #E87A4A;
          text-shadow: 0 0 15px rgba(232, 122, 74, 0.4);
        }
        
        .text-neon-blue {
          color: #3B75F5;
          text-shadow: 0 0 20px rgba(59, 117, 245, 0.5);
        }

        .glass-panel {
          background: rgba(22, 37, 47, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .glossy-btn {
          background: linear-gradient(180deg, #FF9C66 0%, #D84E1A 100%);
          box-shadow: 
            0 10px 20px rgba(232, 122, 74, 0.4),
            inset 0 2px 3px rgba(255, 255, 255, 0.5),
            inset 0 -3px 5px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .glossy-btn:active {
          transform: translateY(2px);
          box-shadow: 
            0 5px 10px rgba(232, 122, 74, 0.4),
            inset 0 3px 6px rgba(0, 0, 0, 0.4);
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E87A4A; border-radius: 10px; }
      `}</style>

      {/* Mobile Device Mockup Container */}
      <div className="w-full max-w-[400px] min-h-[100dvh] md:my-auto md:rounded-[40px] app-container overflow-hidden flex flex-col relative md:border-[8px] md:border-[#0e161c]">
        
        {appState === 'splash' && <SplashScreen onNext={() => setAppState('login')} />}
        {appState === 'login' && <LoginScreen onLogin={(pin) => { 
          setCurrentUser(pin); 
          if (pin === '0609') {
            i18n.changeLanguage('ru');
            localStorage.setItem('appLang', 'ru');
          } else if (pin === '1234') {
            i18n.changeLanguage('az');
            localStorage.setItem('appLang', 'az');
          }
          setActiveTab('mixer');
          setAppState('main'); 
        }} />}
        
        {appState === 'main' && (
          <>
            <header className="px-6 pt-12 pb-4 flex items-center justify-between z-10 relative">
              <div className="neo-in px-4 py-2 rounded-2xl relative overflow-hidden flex items-center gap-2">
                <div className="absolute inset-0 bg-[#3B75F5] opacity-15 blur-md pointer-events-none" />
                {currentUser === '0609' && (
                  <span className="text-xs font-black tracking-widest text-[#fff]" style={{
                    textShadow: '0 0 8px rgba(59, 117, 245, 0.9), 0 0 16px rgba(59, 117, 245, 0.6)'
                  }}>
                    GURBANOV
                  </span>
                )}
                {currentUser === '1234' && (
                  <span className="text-xs font-black tracking-widest text-amber-400 flex items-center gap-1.5" style={{
                    textShadow: '0 0 8px rgba(251, 191, 36, 0.9), 0 0 16px rgba(251, 191, 36, 0.6)'
                  }}>
                    <Lock size={12} /> AĠA
                  </span>
                )}
              </div>

              <button 
                onClick={() => { setCurrentUser(null); setAppState('splash'); }}
                className="convex-btn px-4 py-2 rounded-xl text-xs font-bold tracking-wider text-[#E87A4A] hover:text-orange-300 transition-colors uppercase shadow-md flex items-center gap-1.5"
                style={{ textShadow: '0 0 10px rgba(232, 122, 74, 0.5)' }}
              >
                {t('nav.exit')}
              </button>
            </header>

            <main className="flex-1 overflow-y-auto px-6 pb-24 scroll-smooth">
              {activeTab === 'mixer' && <GeneratorTab inventory={inventory} favorites={favorites} setFavorites={setFavorites} />}
              {activeTab === 'bar' && <InventoryTab inventory={inventory} setInventory={setInventory} currentUser={currentUser} />}
              {activeTab === 'favorites' && <FavoritesTab favorites={favorites} setFavorites={setFavorites} />}
            </main>

            <nav className="absolute bottom-0 w-full glass-panel rounded-t-3xl px-6 py-4 flex justify-around items-center z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
              <NavButton 
                icon={<Activity size={22} />} 
                label={t('nav.bar')} 
                isActive={activeTab === 'bar'} 
                onClick={() => setActiveTab('bar')} 
              />
              <NavButton 
                icon={<Zap size={22} />} 
                label={t('nav.mixer')} 
                isActive={activeTab === 'mixer'} 
                onClick={() => setActiveTab('mixer')} 
              />
              <NavButton 
                icon={<Star size={22} />} 
                label={t('nav.fav')} 
                isActive={activeTab === 'favorites'} 
                onClick={() => setActiveTab('favorites')} 
              />
            </nav>
          </>
        )}
      </div>
    </div>
  );
}

// --- SCREENS ---

const const SplashScreen = ({ onNext }: { onNext: () => void }) => {
  const [screen, setScreen] = useState<'shake1' | 'shake2'>('shake1');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [screen]);

  const handleTap = () => {
    if (screen === 'shake1') {
      setScreen('shake2');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black" onClick={handleTap}>
      <video
        ref={videoRef}
        key={screen}
        src={screen === 'shake1' ? '/shake_1.mp4' : '/shake_2.mp4'}
        autoPlay
        muted
        playsInline
        onEnded={() => screen === 'shake2' && onNext()}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
  const { t } = useTranslation();
  const [isShaking, setIsShaking] = useState(false);

  const handleLogoClick = () => {
    if (isShaking) return;
    setIsShaking(true);
    setTimeout(() => {
      onNext();
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative animate-in fade-in duration-700 p-6">
      <div className="absolute inset-0 bg-gradient-to-b from-[#182833] to-[#0e161c] opacity-80" />
      
      <div className="relative z-10 flex flex-col items-center">
        <NeonLogo onClick={handleLogoClick} size="large" isShaking={isShaking} />
        
        <h1 className="mt-8 text-2xl font-bold text-white tracking-widest text-center" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          {t('splash.app_name')}
        </h1>
        <p className="text-[#E87A4A] mt-2 text-xs uppercase tracking-widest text-center" style={{ textShadow: '0 0 10px rgba(232, 122, 74, 0.4)' }}>
          {t('splash.app_author')}
        </p>
        <p className="text-[#8299a9] mt-6 text-xs text-center animate-pulse">
          {t('splash.click_to_start')}
        </p>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin }: { onLogin: (pin: string) => void }) => {
  const [screen, setScreen] = useState<'pin1' | 'pin2'>('pin1');
  const [pin, setPin] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [screen]);

  const handleGo = () => {
    if (pin === '0609' || pin === '0000') {
      setScreen('pin2');
    }
  };

  if (screen === 'pin2') {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <video
          ref={videoRef}
          src="/pin_2.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => onLogin(pin)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <video
        src="/pin_1.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="w-full max-w-[320px] bg-black/40 backdrop-blur-xl rounded-[32px] p-6 border border-white/10 space-y-4">
          <div className="text-center text-white text-xl font-black tracking-[0.3em]">
            ENTER PIN
          </div>

          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\\D/g, ''))}
            maxLength={4}
            placeholder="0609"
            className="w-full h-14 rounded-2xl bg-white/10 border border-white/10 text-center text-white text-2xl tracking-[0.5em] outline-none placeholder:text-white/40"
          />

          <button
            onClick={handleGo}
            disabled={pin !== '0609' && pin !== '0000'}
            className="w-full h-14 rounded-2xl bg-orange-500 text-white font-black tracking-[0.2em] disabled:opacity-40 active:scale-95 transition-all"
          >
            GO >>>>
          </button>
        </div>
      </div>
    </div>
  );
};
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleSubmit = () => {
    if (pin === '0609' || pin === '1234') {
      onLogin(pin);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setPin('');
      }, 600);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative animate-in slide-in-from-right duration-500">
      
      <div className="w-full relative mt-16 p-8 pt-16 bg-[#16252f]/90 backdrop-blur-xl rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
           style={{ border: '2px solid rgba(232, 122, 74, 0.15)', boxShadow: '0 0 30px rgba(232, 122, 74, 0.1), inset 0 0 20px rgba(0,0,0,0.5)' }}>
        
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 scale-[0.55]">
          <NeonLogo size="small" />
        </div>

        <h2 className="text-center text-3xl font-bold text-[#E87A4A] mb-1" style={{ textShadow: '0 0 15px rgba(232, 122, 74, 0.3)' }}>
          {t('login.title')}
        </h2>
        <p className="text-center text-xs text-[#8299a9] uppercase tracking-widest mb-8">
          {t('login.pin_prompt')}
        </p>

        <div className={`flex justify-center gap-4 mb-8 ${error ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                pin.length > i 
                  ? 'bg-[#E87A4A] shadow-[0_0_12px_#E87A4A]' 
                  : 'bg-[#131f28] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.05)]'
              }`} 
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-y-4 gap-x-6 max-w-[240px] mx-auto mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num} 
              onClick={() => handleKeyPress(num)} 
              className="neo-btn rounded-full aspect-square flex items-center justify-center text-2xl font-medium text-[#e0e5e9]"
            >
              {num}
            </button>
          ))}
          <div />
          <button 
            onClick={() => handleKeyPress(0)} 
            className="neo-btn rounded-full aspect-square flex items-center justify-center text-2xl font-medium text-[#e0e5e9]"
          >
            0
          </button>
          <button 
            onClick={handleDelete} 
            className="neo-btn rounded-full aspect-square flex items-center justify-center text-[#E87A4A] hover:text-red-400"
          >
            <Delete size={24} />
          </button>
        </div>

        <button 
          onClick={handleSubmit} 
          className="w-full py-4 rounded-[20px] glossy-btn font-bold text-lg text-white uppercase tracking-wider"
        >
          {t('login.submit')}
        </button>
      </div>
    </div>
  );
};

const NavButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 w-20"
  >
    <div className={`p-3 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#213544] text-[#E87A4A] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)]' : 'text-[#6a8396]'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold tracking-widest transition-colors ${isActive ? 'text-[#E87A4A]' : 'text-[#6a8396]'}`}>
      {label}
    </span>
  </button>
);

const GeneratorTab = ({ inventory, favorites, setFavorites }: { inventory: any[], favorites: any[], setFavorites: any }) => {
  const { t, i18n } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [drinkMode, setDrinkMode] = useState('non-alcoholic'); // 'non-alcoholic' (default), 'alcoholic', 'exclusive'
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [result, setResult] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt((prev) => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = i18n.language === 'az' ? 'az-AZ' : 'ru-RU';
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error(e);
          setIsListening(false);
        }
      } else {
        alert("Голосовой ввод не поддерживается в вашем браузере.");
      }
    }
  };

  const quickRequests = [
    { label: t('quick.mango_label'), text: t('quick.mango_text') },
    { label: t('quick.citrus_label'), text: t('quick.citrus_text') },
    { label: t('quick.berry_label'), text: t('quick.berry_text') },
    { label: t('quick.mint_label'), text: t('quick.mint_text') },
    { label: t('quick.coconut_label'), text: t('quick.coconut_text') }
  ];

  const handleQuickSelect = (text: string) => {
    setPrompt(text);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError('');
    setResult(null);
    setImageUrl(null);

    try {
      setLoadingStage(t('mixer.picking_ingredients'));
      const recipe = await generateRecipe(prompt, inventory, drinkMode, i18n.language);
      setResult(recipe);

      setLoadingStage(t('mixer.visualizing'));
      const img = await generateImage(recipe);
      setImageUrl(img);
      
    } catch (err) {
      setError(t('mixer.error'));
    } finally {
      setIsGenerating(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-neon-orange uppercase tracking-wider mb-2">
        {t('mixer.title')}
      </h2>

      <div className="neo-out rounded-3xl p-5 space-y-4">
        {/* Переключатели режимов приготовления лимонада */}
        <div className="grid grid-cols-3 gap-2 p-1 neo-in rounded-2xl">
          <button
            onClick={() => setDrinkMode('non-alcoholic')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all uppercase truncate ${
              drinkMode === 'non-alcoholic' 
                ? 'bg-[#E87A4A] text-white shadow-[0_0_12px_rgba(232,122,74,0.6)]' 
                : 'text-[#8299a9] hover:text-white'
            }`}
          >
            {t('mixer.non_alcoholic')}
          </button>
          <button
            onClick={() => setDrinkMode('alcoholic')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all uppercase truncate ${
              drinkMode === 'alcoholic' 
                ? 'bg-[#E87A4A] text-white shadow-[0_0_12px_rgba(232,122,74,0.6)]' 
                : 'text-[#8299a9] hover:text-white'
            }`}
          >
            {t('mixer.alcoholic')}
          </button>
          <button
            onClick={() => setDrinkMode('exclusive')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all uppercase truncate ${
              drinkMode === 'exclusive' 
                ? 'bg-[#E87A4A] text-white shadow-[0_0_12px_rgba(232,122,74,0.6)]' 
                : 'text-[#8299a9] hover:text-white'
            }`}
          >
            {t('mixer.exclusive')}
          </button>
        </div>

        <p className="text-sm text-[#8299a9]">{t('mixer.guest_prompt')}</p>
        
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickRequests.map((req, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickSelect(req.text)}
              className="neo-btn px-3 py-1.5 rounded-xl text-[11px] font-semibold text-[#a0b5c4] hover:text-white hover:border-[#E87A4A]/50 transition-all flex items-center gap-1 active:scale-95"
            >
              <Sparkles size={11} className="text-[#E87A4A]" /> {req.label}
            </button>
          ))}
        </div>

        <div className="neo-in rounded-2xl p-4 flex items-start gap-3 mt-2">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('mixer.placeholder')}
            className="bg-transparent border-none outline-none w-full text-[#e0e5e9] placeholder-[#536d7d] resize-none h-20 text-sm"
          />
          <button 
            onClick={toggleListening}
            className={`neo-btn p-3 rounded-full shrink-0 mt-auto transition-colors ${isListening ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-[#E87A4A]'}`}
          >
            <Mic size={18} />
          </button>
        </div>

        <ShakeButton 
          onClick={handleGenerate}
          disabled={isGenerating || inventory.length === 0}
          loading={isGenerating}
          isShaking={isGenerating}
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-8">
          <div className="neo-out rounded-3xl p-4 flex flex-col items-center justify-center aspect-square relative overflow-hidden group">
            {imageUrl ? (
              <img src={imageUrl} alt={result.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-[#536d7d] animate-pulse">
                <ImageIcon size={40} />
                <p className="text-sm font-medium">{t('mixer.generating_photo')}</p>
              </div>
            )}
            
            <button 
              onClick={() => {
                const isFav = favorites.some(f => f.name === result.name);
                if (isFav) {
                  setFavorites(favorites.filter(f => f.name !== result.name));
                } else {
                  setFavorites([...favorites, { ...result, imageUrl }]);
                }
              }}
              className="absolute top-6 right-6 p-3 rounded-2xl glass-panel text-white hover:text-[#E87A4A] transition-colors z-10"
            >
              <Star 
                size={22} 
                className={favorites.some(f => f.name === result.name) ? "fill-[#E87A4A] text-[#E87A4A]" : ""}
              />
            </button>

            <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-1">{result.name}</h3>
              <div className="flex items-center gap-4 text-xs text-[#a0b5c4]">
                <span className="flex items-center gap-1"><Wine size={12}/> {result.glass}</span>
                <span className="flex items-center gap-1"><Leaf size={12}/> {result.garnish}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="neo-out rounded-3xl p-5 col-span-2 md:col-span-1 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-white">{t('mixer.ingredients')}</h4>
                <Droplet size={14} className="text-[#E87A4A]" />
              </div>
              <ul className="space-y-3">
                {result.ingredients.map((ing: any, idx: number) => (
                  <li key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                    <span className="text-[#a0b5c4]">{ing.name}</span>
                    <span className="font-semibold text-neon-orange">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="neo-out rounded-3xl p-5 col-span-2 md:col-span-1 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-white">{t('mixer.preparation')}</h4>
                <Check size={14} className="text-[#3B75F5]" />
              </div>
              <ol className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-white/5">
                {result.steps.map((step: string, idx: number) => (
                  <li key={idx} className="text-xs text-[#8299a9] relative pl-8">
                    <span className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-[#182833] border-2 border-[#3B75F5] flex items-center justify-center text-[10px] text-white font-bold z-10 shadow-[0_0_10px_rgba(59,117,245,0.4)]">
                      {idx + 1}
                    </span>
                    <span className="block pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InventoryTab = ({ inventory, setInventory, currentUser }: { inventory: any[], setInventory: any, currentUser: string | null }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Сиропы');
  const isReadOnly = currentUser === '1234';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!newName.trim()) return;
    setInventory([...inventory, { id: Date.now(), name: newName.trim(), category: newCategory, image: null }]);
    setNewName('');
  };

  const handleRemove = (id: number) => {
    if (isReadOnly) return;
    setInventory(inventory.filter((item: any) => item.id !== id));
  };

  const categories = ['Газировки', 'Сиропы', 'Пюре и Топпинги', 'Bobas', 'Алкоголь', 'Фрукты и Лёд'];

  const groupedInventory = categories.reduce((acc: any, cat: string) => {
    acc[cat] = inventory.filter((item: any) => item.category === cat);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-neon-orange uppercase tracking-wider">
          {t('bar.title', { count: inventory.length })}
        </h2>
        {isReadOnly && (
          <span className="text-[11px] bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20 flex items-center gap-1.5">
            <Lock size={12} /> {t('nav.view_mode')}
          </span>
        )}
      </div>

      {!isReadOnly && (
        <div className="neo-out rounded-3xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-white">{t('bar.add_product')}</h3>
            <Plus size={18} className="text-[#E87A4A]" />
          </div>
          
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="neo-in rounded-xl p-1 flex">
               <input 
                type="text" 
                placeholder={t('bar.placeholder')} 
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-transparent border-none outline-none px-4 py-3 text-sm text-white placeholder-[#536d7d]"
              />
            </div>
            
            <div className="neo-in rounded-xl p-1">
              <select 
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full bg-transparent border-none outline-none px-3 py-3 text-xs text-[#8299a9] appearance-none cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c} className="bg-[#15232d]">{t(`categories.${c}`)}</option>)}
              </select>
            </div>
            
            <button type="submit" className="w-full py-3 rounded-[15px] glossy-btn text-white font-bold text-sm tracking-widest uppercase">
              {t('bar.submit')}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {categories.map(cat => {
          const items = groupedInventory[cat] || [];
          if (items.length === 0) return null;

          return (
            <div key={cat} className="neo-out rounded-3xl p-5">
              <div className="inline-flex neo-in px-4 py-2 rounded-xl mb-4 items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-neon-orange flex items-center gap-1.5">
                  <ChevronRight size={14} /> {t(`categories.${cat}`)}
                </h3>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item: any) => (
                  <div key={item.id} className="neo-in rounded-2xl p-2.5 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#182833] border border-[#E87A4A]/30 flex items-center justify-center text-[#E87A4A] overflow-hidden shrink-0 shadow-inner">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Beaker size={14} className="text-[#8299a9]" />
                        )}
                      </div>
                      <span className="font-semibold text-[#e0e5e9] text-xs">{t(`ingredients.${item.name}`, item.name)}</span>
                    </div>

                    {!isReadOnly && (
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-[#6a8396] hover:text-red-400 transition-colors p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FavoritesTab = ({ favorites, setFavorites }: { favorites: any[], setFavorites: any }) => {
  const { t } = useTranslation();
  const handleRemove = (name: string) => {
    setFavorites(favorites.filter((f: any) => f.name !== name));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <h2 className="text-xl font-bold text-neon-orange uppercase tracking-wider mb-2">
        {t('favorites.title')}
      </h2>

      <div className="neo-out rounded-3xl p-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-bold text-white">{t('favorites.subtitle')}</h3>
          <span className="text-xs text-[#E87A4A] cursor-pointer">{t('favorites.total', { count: favorites.length })}</span>
        </div>

        <div className="space-y-4">
          {favorites.map((cocktail: any, idx: number) => (
            <div key={idx} className="neo-in rounded-2xl p-3 flex items-center gap-4 relative group">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#182833] flex-shrink-0">
                {cocktail.imageUrl ? (
                  <img src={cocktail.imageUrl} alt={cocktail.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#536d7d]">
                    <Wine size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-[#e0e5e9] truncate text-sm">{cocktail.name}</h4>
                <div className="flex gap-2 text-[10px] text-[#6a8396] mt-1">
                  <span className="flex items-center gap-1"><Wine size={10}/> {cocktail.glass}</span>
                </div>
              </div>
              <button 
                onClick={() => handleRemove(cocktail.name)}
                className="p-2 text-[#6a8396] hover:text-red-400 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          {favorites.length === 0 && (
            <div className="text-center py-10 text-[#536d7d] text-sm">
              {t('favorites.empty')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};