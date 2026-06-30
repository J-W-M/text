import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, RotateCcw, ChevronRight } from 'lucide-react';

interface DialogueLine {
  speaker: string;
  text: string;
  background: string;
  character?: {
    name: string;
    position: 'left' | 'center' | 'right';
    mood: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised';
  };
  choices?: {
    text: string;
    nextIndex: number;
  }[];
}

const storyData: DialogueLine[] = [
  {
    speaker: '旁白',
    text: '夜幕降临，月光洒在古老的神社石阶上。空气中弥漫着樱花的芬芳，一切都显得如此宁静...',
    background: 'shrine',
  },
  {
    speaker: '？？？',
    text: '你终于来了。我等你很久了。',
    background: 'shrine',
    character: {
      name: 'mystery',
      position: 'center',
      mood: 'normal',
    },
  },
  {
    speaker: '你',
    text: '你是...谁？为什么我会在这里？',
    background: 'shrine',
  },
  {
    speaker: '神秘少女',
    text: '我叫灵汐，是这座神社的守护者。而你...是被选中的人。',
    background: 'shrine',
    character: {
      name: 'lingxi',
      position: 'center',
      mood: 'normal',
    },
  },
  {
    speaker: '你',
    text: '被选中的人？这是什么意思？',
    background: 'shrine',
  },
  {
    speaker: '灵汐',
    text: '在你面前有两条路。一条通向光明，一条通向黑暗。你的选择，将决定这个世界的命运。',
    background: 'shrine',
    character: {
      name: 'lingxi',
      position: 'center',
      mood: 'serious',
    },
    choices: [
      { text: '选择光明之路', nextIndex: 7 },
      { text: '选择黑暗之路', nextIndex: 10 },
    ],
  },
  {
    speaker: '灵汐',
    text: '你做出了勇敢的选择。跟我来吧，让我带你看看这个世界的真相。',
    background: 'shrine',
    character: {
      name: 'lingxi',
      position: 'center',
      mood: 'happy',
    },
  },
  {
    speaker: '旁白',
    text: '灵汐轻轻挥动手袖，一道金色的光芒在你们身边绽放...',
    background: 'light',
  },
  {
    speaker: '灵汐',
    text: '欢迎来到光明之境。在这里，每一个灵魂都能找到属于自己的安宁。',
    background: 'paradise',
    character: {
      name: 'lingxi',
      position: 'left',
      mood: 'happy',
    },
  },
  {
    speaker: '你',
    text: '这里...好美啊。',
    background: 'paradise',
  },
  {
    speaker: '灵汐',
    text: '你的旅程才刚刚开始。准备好了吗？',
    background: 'paradise',
    character: {
      name: 'lingxi',
      position: 'center',
      mood: 'happy',
    },
  },
  {
    speaker: '灵汐',
    text: '你确定要选择这条路吗？一旦踏上，就再也无法回头了...',
    background: 'shrine',
    character: {
      name: 'lingxi',
      position: 'center',
      mood: 'sad',
    },
  },
  {
    speaker: '旁白',
    text: '灵汐的身影渐渐融入黑暗中，四周的温度仿佛骤然下降...',
    background: 'dark',
  },
  {
    speaker: '神秘声音',
    text: '有趣...真是有趣的选择。欢迎来到深渊的入口。',
    background: 'abyss',
  },
  {
    speaker: '你',
    text: '这里是...哪里？',
    background: 'abyss',
  },
  {
    speaker: '神秘声音',
    text: '这里是一切的终点，也是一切的起点。你的真正考验，现在才开始。',
    background: 'abyss',
  },
];

const backgrounds: Record<string, string> = {
  shrine:
    'linear-gradient(180deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%)',
  light: 'linear-gradient(180deg, #fff8e7 0%, #ffecd2 50%, #fcb69f 100%)',
  paradise:
    'linear-gradient(180deg, #a8edea 0%, #fed6e3 50%, #ffecd2 100%)',
  dark: 'linear-gradient(180deg, #0c0c0c 0%, #1a1a2e 50%, #000000 100%)',
  abyss: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #0d0d1a 100%)',
};

const characterColors: Record<string, string> = {
  lingxi: '#D4AF37',
  mystery: '#8A72A5',
};

export default function VisualNovel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const typingRef = useRef<number | null>(null);

  const currentLine = storyData[currentIndex];

  const typeText = useCallback((text: string) => {
    setIsTyping(true);
    setDisplayedText('');
    let index = 0;

    if (typingRef.current) {
      clearInterval(typingRef.current);
    }

    typingRef.current = window.setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        if (typingRef.current) {
          clearInterval(typingRef.current);
        }
      }
    }, 50);
  }, []);

  useEffect(() => {
    if (currentLine) {
      typeText(currentLine.text);
      setShowChoices(false);
    }

    return () => {
      if (typingRef.current) {
        clearInterval(typingRef.current);
      }
    };
  }, [currentIndex, currentLine, typeText]);

  const handleClick = useCallback(() => {
    if (gameEnded) return;

    if (isTyping) {
      if (typingRef.current) {
        clearInterval(typingRef.current);
      }
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }

    if (currentLine.choices) {
      setShowChoices(true);
      return;
    }

    if (currentIndex < storyData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameEnded(true);
    }
  }, [isTyping, currentLine, currentIndex, gameEnded]);

  const handleChoice = (nextIndex: number) => {
    setShowChoices(false);
    setCurrentIndex(nextIndex);
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setGameEnded(false);
    setDisplayedText('');
    setShowChoices(false);
  };

  const getCharacterStyle = (mood: string) => {
    switch (mood) {
      case 'happy':
        return 'scale-105';
      case 'sad':
        return 'scale-95 opacity-80';
      case 'angry':
        return 'scale-110';
      case 'surprised':
        return 'scale-105 -translate-y-2';
      default:
        return '';
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden cursor-pointer select-none"
      onClick={handleClick}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLine.background}
          className="absolute inset-0"
          style={{ background: backgrounds[currentLine.background] }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none">
        {currentLine.background === 'shrine' && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-pink-300/60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                }}
                animate={{
                  y: ['0vh', '100vh'],
                  x: [0, `${(Math.random() - 0.5) * 200}px`],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 6,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                  ease: 'linear',
                }}
              />
            ))}
          </>
        )}
        {currentLine.background === 'paradise' && (
          <>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-yellow-200/80"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        )}
        {currentLine.background === 'abyss' && (
          <>
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-purple-500/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                }}
              />
            ))}
          </>
        )}
      </div>

      <AnimatePresence>
        {currentLine.character && (
          <motion.div
            key={`${currentIndex}-${currentLine.character.name}`}
            className={`absolute bottom-32 ${
              currentLine.character.position === 'left'
                ? 'left-1/4'
                : currentLine.character.position === 'right'
                  ? 'right-1/4'
                  : 'left-1/2 -translate-x-1/2'
            } ${getCharacterStyle(currentLine.character.mood)}`}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="relative">
              <div
                className="w-48 h-72 rounded-t-full opacity-20 blur-3xl absolute -bottom-4 left-1/2 -translate-x-1/2"
                style={{
                  backgroundColor:
                    characterColors[currentLine.character.name] || '#8A72A5',
                }}
              />
              <div
                className="w-48 h-72 rounded-t-full flex items-center justify-center relative border-4 backdrop-blur-sm"
                style={{
                  borderColor:
                    characterColors[currentLine.character.name] || '#8A72A5',
                  background: `linear-gradient(180deg, ${
                    characterColors[currentLine.character.name] || '#8A72A5'
                  }22 0%, ${
                    characterColors[currentLine.character.name] || '#8A72A5'
                  }11 100%)`,
                }}
              >
                <div className="text-center">
                  <div
                    className="text-6xl mb-2"
                    style={{
                      color:
                        characterColors[currentLine.character.name] ||
                        '#8A72A5',
                    }}
                  >
                    {currentLine.character.name === 'lingxi'
                      ? currentLine.character.mood === 'happy'
                        ? '😊'
                        : currentLine.character.mood === 'sad'
                          ? '😢'
                          : currentLine.character.mood === 'angry'
                            ? '😠'
                            : currentLine.character.mood === 'surprised'
                              ? '😮'
                              : '🙂'
                      : '👤'}
                  </div>
                  <div
                    className="text-sm font-serif font-medium"
                    style={{
                      color:
                        characterColors[currentLine.character.name] ||
                        '#8A72A5',
                    }}
                  >
                    {currentLine.character.name === 'lingxi'
                      ? '灵汐'
                      : '神秘身影'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 right-6 flex gap-3 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
          }}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-black/50 transition-all hover:scale-110"
        >
          {soundEnabled ? (
            <Volume2 size={18} />
          ) : (
            <VolumeX size={18} />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            restartGame();
          }}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-black/50 transition-all hover:scale-110"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <AnimatePresence>
        {!showChoices && !gameEnded && (
          <motion.div
            key="dialogue-box"
            className="absolute bottom-0 left-0 right-0 z-10"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="mx-4 mb-6 md:mx-12 md:mb-8">
              <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
                <div className="absolute -top-4 left-8">
                  <motion.div
                    key={currentLine.speaker}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-5 py-1.5 rounded-full text-sm font-serif font-bold"
                    style={{
                      background:
                        currentLine.speaker === '灵汐'
                          ? 'linear-gradient(135deg, #D4AF37, #F5E6CC)'
                          : currentLine.speaker === '你'
                            ? 'linear-gradient(135deg, #5B4B8A, #8A72A5)'
                            : currentLine.speaker === '旁白'
                              ? 'linear-gradient(135deg, #666, #999)'
                              : 'linear-gradient(135deg, #8A72A5, #AF9FC3)',
                      color:
                        currentLine.speaker === '旁白'
                          ? '#fff'
                          : '#1a1a2e',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    {currentLine.speaker}
                  </motion.div>
                </div>

                <div className="mt-4 min-h-[80px]">
                  <p className="text-white/90 text-lg md:text-xl font-serif leading-relaxed">
                    {displayedText}
                    {isTyping && (
                      <span className="inline-block w-0.5 h-5 bg-white/80 ml-1 animate-pulse" />
                    )}
                  </p>
                </div>

                {!isTyping && !currentLine.choices && (
                  <motion.div
                    className="absolute bottom-4 right-6 text-white/50 flex items-center gap-1"
                    animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-sm">点击继续</span>
                    <ChevronRight size={16} />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChoices && currentLine.choices && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col gap-4 px-6">
              {currentLine.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChoice(choice.nextIndex);
                  }}
                  className="px-12 py-4 bg-black/60 backdrop-blur-xl border border-gold/40 rounded-xl text-gold font-serif text-lg hover:bg-gold/20 hover:border-gold/80 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-gold/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {choice.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameEnded && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-center px-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <h2 className="text-4xl md:text-5xl font-serif text-gold mb-6 animate-pulse-glow">
                第一章 · 完
              </h2>
              <p className="text-white/70 text-lg mb-8 font-serif">
                感谢你的游玩
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  restartGame();
                }}
                className="px-8 py-3 bg-gradient-to-r from-gold to-cream text-dark-100 font-serif font-bold rounded-xl hover:scale-105 transition-transform shadow-glow"
              >
                重新开始
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 left-6 z-20">
        <div className="px-4 py-2 bg-black/30 backdrop-blur-md rounded-xl">
          <h1 className="text-gold font-serif text-lg font-bold">
            灵汐物语
          </h1>
        </div>
      </div>
    </div>
  );
}
