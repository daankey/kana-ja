import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [speechRate, setSpeechRate] = useState(0.8);
  const [practiceMode, setPracticeMode] = useState('listening');
  
  // 修改：不再存数组，只存"上一个" (Last One)
  const [lastKana, setLastKana] = useState(null);

  // --- 逻辑区 ---

  // 1. 播放音频
  const playAudio = useCallback((text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = speechRate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [speechRate]);

  // 2. 计算抽奖池
  const activePool = useMemo(() => {
    return kanaData.filter(kana => selectedRows.includes(kana.row));
  }, [selectedRows]);

  // 3. 随机抽取 (核心逻辑)
  const handleNext = useCallback(() => {
      if (activePool.length === 0) return alert("请至少选择一行！");
      
      let nextKana;
      let safeGuard = 0;
      do {
          const idx = Math.floor(Math.random() * activePool.length);
          nextKana = activePool[idx];
          safeGuard++;
      } while (currentKana && nextKana.id === currentKana.id && activePool.length > 1 && safeGuard < 10);

      // --- 核心修改：记录上一个 ---
      if (currentKana) {
          setLastKana(currentKana);
      }

      // 更新当前卡片
      setCurrentKana(nextKana);

      // 播放 (仅听模式)
      if (practiceMode === 'listening') {
          setTimeout(() => playAudio(nextKana.hiragana), 100);
      }
  }, [activePool, currentKana, practiceMode, playAudio]);


  // 4. 处理行选择
  const toggleRow = (rowId) => {
    setSelectedRows(prev => prev.includes(rowId) 
      ? prev.filter(id => id !== rowId) 
      : [...prev, rowId]
    );
  };

  // 5. 快捷键监听
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        handleNext();
      }
      if (event.key === 'q' || event.key === 'Q') {
        if (currentKana) playAudio(currentKana.hiragana);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, currentKana, playAudio]);


  // 初始化
  useEffect(() => { handleNext(); }, []);

  if (!currentKana) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex flex-col items-center p-4 text-white font-sans overflow-hidden">
      
      {/* 动画样式 */}
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5) rotateX(-90deg); }
          60% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .card-anim {
          animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* 顶部控制区 */}
      <div className="w-full max-w-2xl mb-4 space-y-4">
        {/* 范围选择 */}
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

        {/* 模式与语速 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-sm flex flex-col justify-between">
             <div className="text-xs text-white/50 font-bold uppercase mb-2">模式 Mode</div>
             <div className="flex bg-black/20 rounded-lg p-1">
               <button
                 onClick={() => setPracticeMode('reading')}
                 className={`flex-1 py-2 text-xs rounded-md transition-all font-bold ${
                   practiceMode === 'reading' 
                   ? 'bg-indigo-500 text-white shadow-lg' 
                   : 'text-white/50 hover:text-white hover:bg-white/5'
                 }`}
               >
                 👀 看模式
               </button>
               <button
                 onClick={() => setPracticeMode('listening')}
                 className={`flex-1 py-2 text-xs rounded-md transition-all font-bold ${
                   practiceMode === 'listening' 
                   ? 'bg-pink-500 text-white shadow-lg' 
                   : 'text-white/50 hover:text-white hover:bg-white/5'
                 }`}
               >
                 🎧 听模式
               </button>
             </div>
          </div>
          <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-sm flex flex-col justify-center">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-white/50 font-bold uppercase">语速 Speed: {speechRate}x</span>
            </div>
            <input 
              type="range" min="0.1" max="1.5" step="0.1" value={speechRate}
              onChange={(e) => setSpeechRate(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>
      </div>

      {/* 快捷键提示 */}
      <div className="mb-2 text-xs text-white/40 flex gap-4">
        <span>[Space] 下一个</span>
        <span>[Q] 重读</span>
      </div>

      {/* --- 核心区域：主卡片 + 历史卡片 --- */}
      {/* 使用 flex 布局让它们在宽屏并排，窄屏上下排列 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8 perspective-1000 z-10 w-full max-w-4xl">
        
        {/* 1. 上一个 (历史记录) - 如果有才显示 */}
        {lastKana ? (
          <div className="order-2 md:order-1 flex flex-col items-center">
            <div className="text-xs text-white/30 uppercase font-bold mb-2 tracking-widest">Previous 上一个</div>
            <div 
              className="w-40 h-52 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-all hover:bg-white/10"
              title="上一个"
            >
              <div className="text-5xl font-bold mb-2 text-white/80">
                {displayMode === 'hiragana' ? lastKana.hiragana : lastKana.katakana}
              </div>
              {/* 历史记录始终显示答案，方便复习 */}
              <div className="bg-black/20 px-3 py-1 rounded-full text-sm font-mono text-white/50">
                {lastKana.romaji}
              </div>
            </div>
          </div>
        ) : (
           // 占位符，保持布局平衡 (可选)
           <div className="order-2 md:order-1 w-40 hidden md:block"></div>
        )}

        {/* 2. 当前卡片 (主C位) */}
        <div 
          key={currentKana.id}
          onClick={() => playAudio(currentKana.hiragana)}
          className="order-1 md:order-2 card-anim w-64 h-80 cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col items-center justify-center hover:bg-white/15 active:scale-95 transition-colors group relative"
        >
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-white/50">🔊</div>
          
          <div className="text-8xl font-bold mb-4 drop-shadow-2xl">
            {displayMode === 'hiragana' ? currentKana.hiragana : currentKana.katakana}
          </div>
          
          {/* 只有听模式显示答案 */}
          {practiceMode === 'listening' && (
            <div className="bg-black/30 px-5 py-1 rounded-full text-xl font-mono text-pink-200">
              {currentKana.romaji}
            </div>
          )}
          
          <div className="absolute bottom-4 text-xs text-white/20">
            {practiceMode === 'reading' ? '点击播放发音' : '自动播放中'}
          </div>
        </div>

        {/* 右侧占位 (为了让中间的卡片居中) */}
        <div className="order-3 w-40 hidden md:block"></div>
      </div>

      {/* 底部按钮 */}
      <div className="flex gap-4">
        <button 
          onClick={() => playAudio(currentKana.hiragana)}
          className="w-14 h-14 rounded-full bg-indigo-500/30 hover:bg-indigo-500 transition border border-indigo-400/20 flex items-center justify-center text-xl"
        >
          🔊
        </button>
        <button 
          onClick={() => setDisplayMode(prev => prev === 'hiragana' ? 'katakana' : 'hiragana')}
          className="px-6 rounded-2xl bg-white/10 hover:bg-white/20 transition border border-white/10"
        >
          {displayMode === 'hiragana' ? '转片' : '转平'}
        </button>
        <button 
          onClick={handleNext}
          className="px-10 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:shadow-pink-500/40 hover:-translate-y-1 transition font-bold text-lg"
        >
          Next →
        </button>
      </div>

    </div>
  );
}