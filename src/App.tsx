import React, { useState } from 'px'; // на всякий случай оставляем твои импорты, ниже чистый React
import { GoogleGenAI } from '@google/genai';

export default function App() {
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  // Список доступных вкусов для базы данных приложения
  const flavorDatabase = [
    { id: '1', name: 'Monin Maracuja (Маракуйя)' },
    { id: '2', name: 'Milliana Grenadine (Гранат)' },
    { id: '3', name: 'Monin Mint (Мята)' },
    { id: '4', name: 'Monin Blue Curaçao (Кюрасао)' },
    { id: '5', name: 'Monin Lime (Лайм)' }
  ];

  const generateRecipe = async (flavorToUse: string) => {
    const targetFlavor = flavorToUse || selectedFlavor;
    if (!targetFlavor) {
      alert('Пожалуйста, выберите или введите вкус!');
      return;
    }

    setLoading(true);
    setRecipe('');

    try {
      // Инициализация API клиента Google Gen AI (использует стандартный ключ из окружения)
      const ai = new GoogleGenAI();
      
      // Строгий промпт, запрещающий манго и требующий опираться только на выбранный вкус
      const prompt = `Ты профессиональный миксолог и шеф-бармен. Создай уникальный и подробный рецепт коктейля или лимонада.
      КРИТИЧЕСКИ ВАЖНО: В качестве основного и обязательного вкуса/ингредиента используй СТРОГО: "${targetFlavor}".
      Категорически запрещено использовать манго или заменять им этот вкус, если пользователь его не просил.
      Укажи название напитка, точные пропорции ингредиентов, пошаговый метод приготовления и рекомендации по украшению бокала.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setRecipe(response.text || 'Не удалось сгенерировать рецепт.');
    } catch (error) {
      console.error('Ошибка генерации:', error);
      setRecipe('Произошла ошибка при генерации рецепта. Проверьте ключи и соединение.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 flex flex-col items-center justify-start">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl mt-4">
        <h1 className="text-2xl font-bold text-center mb-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
          G-BAR MIXMASTER
        </h1>
        <p className="text-xs text-slate-400 text-center mb-5">База данных напитков и генератор рецептов</p>

        {/* Выбор из базы данных */}
        <label className="block text-sm font-medium text-slate-300 mb-2">Выберите из базы вкусов:</label>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {flavorDatabase.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedFlavor(item.name);
                generateRecipe(item.name);
              }}
              className="text-left px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm transition border border-slate-700/50"
            >
              🍹 {item.name}
            </button>
          ))}
        </div>

        {/* Свой вариант ввода */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Или введите свой вкус / сироп:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
              placeholder="Например: Сироп Бабл-Гам"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => generateRecipe(selectedFlavor)}
              disabled={loading}
              className="bg-gradient-to-r from-pink-600 to-cyan-500 font-semibold px-4 py-2 rounded-xl text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Создаю...' : 'Создать'}
            </button>
          </div>
        </div>

        {/* Вывод рецепта */}
        {recipe && (
          <div className="mt-6 p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
            {recipe}
          </div>
        )}
      </div>
    </div>
  );
}
