import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

export default function App() {
  const [inputText, setInputText] = useState('Сладкий ягодный лимонад с клубникой');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('mixer');

  // Быстрые теги-вкуса (клики меняют текст в поле ввода на выбранный вкус)
  const quickFlavors = [
    "Манго лимонад",
    "Кислый цитрус",
    "Ягодный микс",
    "Мятная свежесть",
    "Кокос-тропик"
  ];

  const handleShake = async () => {
    if (!inputText.trim()) {
      alert("Пожалуйста, введите вкус или выберите из списка!");
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI();
      
      // Строгий промпт, запрещающий заменять вкус на манго и требующий JSON-формат для карточки
      const strictPrompt = `Ты профессиональный миксолог и шеф-бармен. Создай рецепт напитка СТРОГО на основе этого запроса: "${inputText}".
      КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать манго, если пользователь его не просил. Если в запросе указана клубника или ягоды, делай напиток на их основе.
      
      Верни ответ СТРОГО в формате JSON без какого-либо дополнительного текста (без markdown-оберток вроде \`\`\`json):
      {
        "title": "Название напитка на русском",
        "category": "Хайбол",
        "garnish": "Способ подачи и украшение",
        "ingredients": [
          {"name": "Название ингредиента", "amount": "Количество в мл или г"}
        ]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: strictPrompt,
      });

      const textResponse = response.text || '';
      // Очищаем от возможных код-блоков
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);
      setRecipe(parsedData);
    } catch (error) {
      console.error('Ошибка генерации:', error);
      alert('Ошибка при генерации рецепта. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d131f] text-white flex flex-col justify-between select-none font-sans pb-24">
      {/* Верхняя панель */}
      <div className="p-4 flex items-center justify-between">
        <div className="bg-[#141c2e] border border-white/10 px-4 py-2 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] text-cyan-400 font-bold tracking-wider text-sm">
          GURBANOV
        </div>
        <button 
          onClick={() => alert("Выход")}
          className="bg-[#141c2e] border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white shadow-md active:scale-95 transition"
        >
          EXIT
        </button>
      </div>

      {/* Основной контент */}
      <div className="px-4 flex-1 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-[#f59e0b] mb-4 tracking-wide">
          G-BAR MIXMASTER
        </h1>

        {/* Карточка ввода */}
        <div className="bg-[#141c2e]/80 border border-white/5 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex gap-1.5 mb-3">
            <button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md">
              БЕЗАЛКОГОЛЬНЫЙ
            </button>
          </div>

          <p className="text-slate-400 text-xs mb-3">
            Что хочет гость? Выберите вкус или напишите:
          </p>

          {/* Быстрые кнопки вкусов (при клике заменяют текст в поле) */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickFlavors.map((flavor, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(flavor)}
                className="bg-[#1e293b] hover:bg-slate-700 border border-white/5 text-slate-200 text-xs px-3 py-1.5 rounded-full transition active:scale-95 flex items-center gap-1 shadow-sm"
              >
                ✨ {flavor}
              </button>
            ))}
          </div>

          {/* Поле ввода текста */}
          <div className="bg-[#0b101b] border border-white/10 rounded-2xl p-3 mb-4 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Введите вкус..."
              className="w-full bg-transparent text-slate-100 text-sm focus:outline-none resize-none h-16"
            />
          </div>

          {/* Кнопка SHAKE */}
          <button
            onClick={handleShake}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-black italic tracking-wider py-4 rounded-2xl shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center text-lg border border-blue-400/30 disabled:opacity-50"
          >
            {loading ? "СМЕШИВАЕМ..." : "SHAKE"}
          </button>
        </div>

        {/* Вывод сгенерированного рецепта */}
        {recipe && (
          <div className="mt-6 bg-[#141c2e] border border-white/10 rounded-3xl p-5 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-bold text-white">{recipe.title}</h2>
              <button className="text-slate-400 hover:text-yellow-400">⭐</button>
            </div>
            <div className="text-xs text-slate-400 mb-4 flex gap-4">
              <span>🍷 {recipe.category}</span>
              <span>🌿 {recipe.garnish}</span>
            </div>
            <div className="border-t border-white/10 pt-3 space-y-2">
              <div className="text-xs text-slate-500 font-semibold mb-1">Ингредиенты</div>
              {recipe.ingredients?.map((ing: any, i: number) => (
                <div key={i} className="flex justify-between text-sm text-slate-300">
                  <span>{ing.name}</span>
                  <span className="text-orange-400 font-medium">{ing.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Нижняя навигация */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0d131f]/90 backdrop-blur-lg border-t border-white/10 px-6 py-3 flex justify-around items-center z-50">
        <button onClick={() => setActiveTab('bar')} className="flex flex-col items-center text-slate-500 hover:text-slate-300">
          <span className="text-lg">📊</span>
          <span className="text-[10px] tracking-wider mt-0.5">BAR</span>
        </button>
        <button onClick={() => setActiveTab('mixer')} className="flex flex-col items-center text-orange-500">
          <span className="text-lg">⚡</span>
          <span className="text-[10px] tracking-wider mt-0.5">MIXER</span>
        </button>
        <button onClick={() => setActiveTab('fav')} className="flex flex-col items-center text-slate-500 hover:text-slate-300">
          <span className="text-lg">⭐</span>
          <span className="text-[10px] tracking-wider mt-0.5">FAV</span>
        </button>
      </div>
    </div>
  );
}
