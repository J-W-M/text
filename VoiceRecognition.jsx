import React, { useState, useEffect, useRef, useCallback } from 'react';

// Speech Recognition Hook
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'zh-CN';

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimText += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
      setInterimTranscript(interimText);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
  };
};

// Voice Recognition Component
const VoiceRecognition = () => {
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    toggleListening,
    clearTranscript,
  } = useSpeechRecognition();

  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setParticles((prev) => {
          const newParticle = {
            id: Date.now() + Math.random(),
            x: 50 + (Math.random() - 0.5) * 30,
            size: 4 + Math.random() * 8,
            duration: 1 + Math.random() * 1.5,
          };
          const filtered = prev.slice(-12);
          return [...filtered, newParticle];
        });
      }, 150);
      return () => clearInterval(interval);
    } else {
      setParticles([]);
    }
  }, [isListening]);

  if (!isSupported) {
    return (
      <div style={styles.container}>
        <div style={styles.unsupported}>
          <span style={styles.unsupportedIcon}>!</span>
          <p>您的浏览器不支持语音识别</p>
          <p style={styles.unsupportedHint}>请使用 Chrome、Edge 或 Safari 浏览器</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>语音识别</h2>
          <p style={styles.subtitle}>实时语音转文字</p>
        </div>

        <div style={styles.visualizerContainer}>
          <div style={styles.orbContainer}>
            <div style={{
              ...styles.orb,
              ...(isListening ? styles.orbActive : styles.orbIdle),
            }}>
              <div style={styles.orbInner}>
                <svg style={styles.micIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
            </div>
            {isListening && particles.map((particle) => (
              <div
                key={particle.id}
                style={{
                  ...styles.particle,
                  left: `${particle.x}%`,
                  width: particle.size,
                  height: particle.size,
                  animationDuration: `${particle.duration}s`,
                }}
              />
            ))}
          </div>
          <div style={styles.status}>
            <span style={{
              ...styles.statusDot,
              backgroundColor: isListening ? '#10b981' : '#6b7280',
              boxShadow: isListening ? '0 0 12px #10b981' : 'none',
            }} />
            <span style={styles.statusText}>
              {isListening ? '正在聆听...' : '点击开始录音'}
            </span>
          </div>
        </div>

        <div style={styles.transcriptContainer}>
          <div style={styles.transcriptHeader}>
            <span style={styles.transcriptLabel}>识别结果</span>
            {(transcript || interimTranscript) && (
              <button onClick={clearTranscript} style={styles.clearBtn}>
                清空
              </button>
            )}
          </div>
          <div style={styles.transcriptBox}>
            <p style={styles.transcriptText}>
              {transcript}
              {interimTranscript && (
                <span style={styles.interimText}>{interimTranscript}</span>
              )}
              {!transcript && !interimTranscript && (
                <span style={styles.placeholder}>请说话，文字将显示在这里...</span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={toggleListening}
          style={{
            ...styles.recordBtn,
            ...(isListening ? styles.recordBtnActive : styles.recordBtnIdle),
          }}
        >
          <span style={styles.recordBtnText}>
            {isListening ? '停止识别' : '开始识别'}
          </span>
        </button>

        <div style={styles.hint}>
          支持中文、英文等多语言实时识别
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    padding: '20px',
    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '40px 32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#f1f5f9',
    margin: '0 0 8px 0',
    letterSpacing: '0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  visualizerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '28px',
  },
  orbContainer: {
    position: 'relative',
    width: '140px',
    height: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  orbIdle: {
    background: 'linear-gradient(145deg, #2d3748 0%, #1a202c 100%)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.05)',
  },
  orbActive: {
    background: 'linear-gradient(145deg, #059669 0%, #047857 100%)',
    border: '2px solid rgba(16, 185, 129, 0.3)',
    boxShadow: '0 0 40px rgba(16, 185, 129, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  orbInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    width: '36px',
    height: '36px',
    color: '#94a3b8',
    transition: 'color 0.3s ease',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    animation: 'pulse 1.5s ease-out infinite',
    pointerEvents: 'none',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  statusText: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  transcriptContainer: {
    marginBottom: '24px',
  },
  transcriptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  transcriptLabel: {
    fontSize: '12px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontWeight: '500',
  },
  clearBtn: {
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '4px 12px',
    borderRadius: '6px',
    transition: 'background 0.2s ease',
  },
  transcriptBox: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '16px',
    minHeight: '120px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  transcriptText: {
    fontSize: '15px',
    lineHeight: '1.8',
    color: '#e2e8f0',
    margin: 0,
    wordBreak: 'break-word',
  },
  interimText: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  placeholder: {
    color: '#475569',
    fontStyle: 'italic',
  },
  recordBtn: {
    width: '100%',
    padding: '16px 24px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '0.5px',
  },
  recordBtnIdle: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
  },
  recordBtnActive: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
  },
  recordBtnText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  hint: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '12px',
    color: '#475569',
  },
  unsupported: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
  },
  unsupportedIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  unsupportedHint: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '8px',
  },
};

// Global styles for animations
const globalStyles = `
  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }
  
  @keyframes orb-pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

export default VoiceRecognition;
