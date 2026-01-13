import React, { useState, useEffect, useMemo } from 'react';
import { kanaData } from './kana';

// 预定义行选项
const ROW_OPTIONS = [
  { id: 'a', label: 'あ行' }, { id: 'ka', label: 'か行' },
  { id: 'sa', label: 'さ行' }, { id: 'ta', label: 'た行' },
  { id: 'na', label: 'な行' }, { id: 'ha', label: 'は行' },
  { id: 'ma', label: 'ま行' }, { id: 'ya', label: 'や行' },
  { id: 'ra', label: 'ら行' }, { id: 'wa', label: 'わ行' },
];

export default function App() {
  // --- 状态管理 ---
  const [currentKana, setCurrentKana] = useState(null);
  const [displayMode, setDisplayMode] = useState('hiragana');
  const [selectedRows, setSelectedRows] = useState(['a', 'ka', 'sa']);
  
  // 新增：语速状态 (0.5 是慢，1.0 是正常，2.0 是快)
  const [speechRate, setSpeechRate] = useState(0.8);

  // --- 逻辑区 ---

  // 1. 播放音频 (已升级支持语速调节)
  const playAudio = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = speechRate; // 这里使用了状态里的语速
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // 2. 计算抽奖池
  const activePool = useMemo(() => {
    return kanaData.filter(kana => selectedRows.includes(kana.row));
  }, [selectedRows]);

  // 3. 随机抽取
  const randomize = () => {
    if (activePool.length === 0) return alert("请至少选择一行！");

    const randomIndex = Math.floor(Math.random() * activePool.length);
    const nextKana = activePool[randomIndex];
    
    // 防重
    if (currentKana && nextKana.id === currentKana.id && activePool.length > 1) {
      randomize();
      return;
    }

    setCurrentKana(nextKana);
    
    // 这里做了一个小技巧：为了让声音和动画配合完美，我们延时一点点播放声音
    setTimeout(() => playAudio(nextKana.hiragana), 100);
  };

  // 4. 处理行选择
  const toggleRow = (rowId) => {
    setSelectedRows(prev => prev.includes(rowId) 
      ? prev.filter(id => id !== rowId) 
      : [...prev, rowId]
    );
  };

  useEffect(() => { randomize(); }, []);

  if (!currentKana) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex flex-col items-center p-4 text-white font-sans overflow-hidden">
      
      {/* 在这里插入一段 CSS 动画样式 (Q弹效果) */}
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5) rotateX(-90deg); }
          60% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .card-anim {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* 顶部控制区 */}
      <div className="w-full max-w-2xl mb-6 space-y-4">
        
        {/* 1. 范围选择 */}
        <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-sm">
          <div className="text-xs text-white/50 mb-2 font-bold uppercase">练习范围 Range</div>
          <div className="flex flex-wrap gap-2">
            {ROW_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleRow(opt.id)}
                className={`px-3 py-1 rounded-md text-xs transition-all border ${
                  selectedRows.includes(opt.id)
                    ? 'bg-pink-500 border-pink-500 text-white'
                    : 'bg-transparent border-white/10 text-white/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 语速调节滑块 (新功能！) */}
        <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-sm flex items-center justify-between">
          <span className="text-xs text-white/50 font-bold uppercase">语速 Speed: {speechRate}x</span>
          <input 
            type="range" 
            min="0.1" 
            max="1.5" 
            step="0.1" 
            value={speechRate}
            onChange={(e) => setSpeechRate(Number(e.target.value))}
            className="w-48 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>
      </div>

      {/* 核心卡片区 */}
      <div className="relative mb-10 perspective-1000">
        {/* 关键点：key={currentKana.id} 
          React 只要看到 key 变了，就会把旧的删掉，创建新的。
          这会强制触发 .card-anim 的动画重新播放！
        */}
        <div 
          key={currentKana.id}
          onClick={() => playAudio(currentKana.hiragana)}
          className="card-anim w-64 h-80 cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col items-center justify-center hover:bg-white/15 active:scale-95 transition-colors"
        >
          <div className="text-8xl font-bold mb-4 drop-shadow-2xl">
            {displayMode === 'hiragana' ? currentKana.hiragana : currentKana.katakana}
          </div>
          <div className="bg-black/30 px-5 py-1 rounded-full text-xl font-mono text-pink-200">
            {currentKana.romaji}
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="flex gap-4">
        <button 
          onClick={() => playAudio(currentKana.hiragana)}
          className="px-6 py-3 rounded-xl bg-indigo-500/40 hover:bg-indigo-500 transition border border-indigo-400/30"
        >
          🔊 重读
        </button>

        <button 
          onClick={randomize}
          className="px-10 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:shadow-pink-500/40 hover:-translate-y-1 transition font-bold text-lg"
        >
          下一个 →
        </button>
      </div>

    </div>
  );
}