'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  AlertCircle, 
  User, 
  Minimize2, 
  Trash2,
  Stethoscope,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Headphones,
  CheckCircle2,
  AudioLines as WaveIcon,
  Play
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isEmergency?: boolean;
}

export const AIChatModal: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      role: 'assistant',
      content: `Hello! I am your **MediMate AI Health Copilot** with voice assistance. 🩺🎙️\n\nYou can speak directly into your microphone or type your symptoms to receive instant clinical guidance.\n\n*Note: I provide health education and care navigation, not medical diagnosis. In case of emergency, dial 108/911 immediately.*`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- VOICE ASSISTANT STATE ---
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const quickPrompts = [
    'Safe home care for a child with mild fever',
    'What lifestyle changes help manage PCOS?',
    'When should I consult a cardiologist?',
    'Dietary tips for managing blood sugar levels',
  ];

  const quickVoiceDemoQuestions = [
    'I have sudden severe headache and dizziness',
    'What is normal fasting blood sugar range?',
    'Safe home care for child with 101 fever',
    'How can I lower my cholesterol naturally?'
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isVoiceMode]);

  // Clean up on unmount or close
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListeningCleanup();
    };
  }, []);

  const stopListeningCleanup = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
    setIsListening(false);
    setMicVolume(0);
  };

  const getLanguageCode = () => {
    switch (language) {
      case 'te': return 'te-IN';
      case 'hi': return 'hi-IN';
      case 'ta': return 'ta-IN';
      default: return 'en-US';
    }
  };

  // --- TEXT TO SPEECH (AI SPEAKING) ---
  const speakText = (text: string, messageId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/`/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = getLanguageCode();
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = getLanguageCode().split('-')[0];
    const matchedVoice = voices.find((v) => v.lang.startsWith(langPrefix) || v.lang.includes('IN') || v.lang.includes('US'));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setSpeakingMessageId(messageId);
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };

  // --- SPEECH TO TEXT (MIC INPUT WITH AUDIO ANALYSIS) ---
  const startListeningWithAudioAnalysis = async () => {
    setMicError(null);
    stopSpeaking();

    // 1. Explicitly request microphone stream to ensure browser permissions are awake
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
    } catch (err: any) {
      console.warn('Microphone permission request error:', err);
      setMicError('Microphone permission needed. Please allow microphone access in your browser address bar.');
      return;
    }

    // 2. Setup real-time audio volume analysis to visualize microphone input
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          setMicVolume(Math.min(100, Math.round((average / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      }
    } catch (e) {
      console.warn('AudioContext volume meter setup skipped:', e);
    }

    // 3. Initialize Web Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = getLanguageCode();
      recognition.continuous = true; // Stay active while user speaks
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceTranscript('🎙️ Listening... (Speak your question now)');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setVoiceTranscript(transcript);
          setInput(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        if (event.error === 'no-speech') {
          setVoiceTranscript('Listening... Please speak clearly into your mic.');
        } else if (event.error === 'not-allowed') {
          setMicError('Microphone blocked. Please grant microphone access in the address bar.');
          stopListeningCleanup();
        } else if (event.error === 'network') {
          // Retry with en-US fallback if regional language speech service has network lag
          recognition.lang = 'en-US';
        }
      };

      recognition.onend = () => {
        // Recognition completed
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Speech recognition start failed:', err);
      setMicError('Could not start voice recognition: ' + (err.message || 'Unknown error'));
      stopListeningCleanup();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      const captured = input.trim();
      stopListeningCleanup();
      if (captured && isVoiceMode) {
        handleSend(captured);
      }
    } else {
      startListeningWithAudioAnalysis();
    }
  };

  // 1-Click Simulated Voice Query (Guaranteed Hackathon Voice Demo)
  const handleSimulatedVoiceQuery = (demoText: string) => {
    setInput(demoText);
    setVoiceTranscript(`🗣️ Spoken: "${demoText}"`);
    handleSend(demoText);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    stopSpeaking();
    stopListeningCleanup();

    const userMsgId = `u-${Date.now()}`;
    const newMessages: Message[] = [...messages, { id: userMsgId, role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setVoiceTranscript('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          language,
        }),
      });

      const data = await res.json();
      const assistantMsgId = `a-${Date.now()}`;
      const replyContent = data.reply || data.error || 'I could not process that health request.';

      const updatedMessages: Message[] = [
        ...newMessages,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: replyContent,
          isEmergency: data.isEmergency,
        },
      ];

      setMessages(updatedMessages);

      if (autoSpeak || isVoiceMode) {
        speakText(replyContent, assistantMsgId);
      }
    } catch (err: any) {
      const errorMsgId = `err-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: errorMsgId,
          role: 'assistant',
          content: '⚠️ Network connection issue. Unable to connect to the healthcare copilot service.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    stopSpeaking();
    stopListeningCleanup();
    setMessages([
      {
        id: 'm-reset',
        role: 'assistant',
        content: `Chat cleared. How can I assist you with your health questions today?`,
      },
    ]);
  };

  const latestAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-primary-600 via-teal-600 to-indigo-600 hover:scale-105 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-primary-500/30 transition-all group font-medium text-sm"
          aria-label={t.aiCopilotButton}
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <span className="hidden sm:inline font-bold">{t.aiCopilotButton}</span>
          <span className="bg-white/20 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <Mic className="w-3 h-3 text-amber-300" />
            <span>Voice Active</span>
          </span>
        </button>
      )}

      {/* Main Copilot Modal Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[450px] max-h-[88vh] h-[650px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-teal-700 p-4 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  {t.aiCopilotTitle}
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-primary-200 font-medium">
                    {t.aiCopilotSubtitle}
                  </span>
                  <span className="text-[9px] bg-teal-400/20 text-teal-200 border border-teal-300/30 px-1.5 py-0.2 rounded font-bold">
                    Dual Voice & Text
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Toggle Voice Mode / Chat Mode */}
              <button
                onClick={() => {
                  stopSpeaking();
                  stopListeningCleanup();
                  setIsVoiceMode(!isVoiceMode);
                }}
                title={isVoiceMode ? 'Switch to Chat View' : 'Switch to AI Voice Assistant Mode'}
                className={`p-1.5 rounded-xl transition flex items-center gap-1 text-xs font-bold ${
                  isVoiceMode
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">{isVoiceMode ? 'Chat' : 'Voice UI'}</span>
              </button>

              {/* Auto speak toggle */}
              <button
                onClick={() => {
                  if (speakingMessageId) stopSpeaking();
                  setAutoSpeak(!autoSpeak);
                }}
                title={autoSpeak ? 'Voice Narration: ON' : 'Voice Narration: OFF'}
                className={`p-1.5 rounded-lg transition ${
                  autoSpeak ? 'text-amber-300 hover:bg-white/10' : 'text-white/40 hover:text-white/80'
                }`}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={clearChat}
                title="Clear conversation"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  stopListeningCleanup();
                  setIsOpen(false);
                }}
                title="Close"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Microhpone Error Banner if permission or hardware error */}
          {micError && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-xs text-rose-800 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{micError}</span>
              </div>
              <button
                onClick={() => setMicError(null)}
                className="text-xs font-bold text-rose-900"
              >
                ✕
              </button>
            </div>
          )}

          {/* MODE 1: DEDICATED HANDS-FREE AI VOICE ASSISTANT INTERFACE */}
          {isVoiceMode ? (
            <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-y-auto">
              <div className="flex-1 flex flex-col items-center justify-center space-y-5 text-center my-2">
                {/* 3D Animated AI Voice Sphere */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`absolute w-36 h-36 rounded-full blur-xl transition-all duration-700 ${
                      isListening
                        ? 'bg-emerald-500/40 animate-ping'
                        : speakingMessageId
                        ? 'bg-teal-500/40 animate-pulse'
                        : loading
                        ? 'bg-amber-500/30 animate-spin'
                        : 'bg-primary-500/20'
                    }`}
                  />

                  <div
                    onClick={toggleListening}
                    className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl cursor-pointer transition-all duration-500 ${
                      isListening
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 scale-110 shadow-emerald-500/50 ring-4 ring-emerald-300'
                        : speakingMessageId
                        ? 'bg-gradient-to-tr from-primary-500 to-indigo-500 scale-105 shadow-primary-500/50 ring-4 ring-primary-300 animate-pulse'
                        : loading
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/50'
                        : 'bg-gradient-to-tr from-primary-600 to-teal-600 shadow-teal-500/30 hover:scale-105'
                    }`}
                  >
                    {isListening ? (
                      <Mic className="w-10 h-10 text-white animate-bounce" />
                    ) : speakingMessageId ? (
                      <Volume2 className="w-10 h-10 text-white animate-pulse" />
                    ) : loading ? (
                      <Sparkles className="w-10 h-10 text-white animate-spin" />
                    ) : (
                      <Bot className="w-10 h-10 text-white" />
                    )}
                    {isListening && (
                      <span className="text-[10px] font-black tracking-wider text-emerald-950 mt-1 uppercase">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Real-time Dynamic Mic Volume Visualizer Bars */}
                {isListening && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                        Mic Signal: {micVolume}%
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1 h-6">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => {
                        const active = (micVolume / 10) >= bar;
                        return (
                          <div
                            key={bar}
                            className={`w-1.5 rounded-full transition-all duration-100 ${
                              active
                                ? 'bg-emerald-400 h-5 animate-pulse'
                                : 'bg-slate-700 h-1.5'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Voice Status Text */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base tracking-tight">
                    {isListening
                      ? '🎙️ Listening... (Speak your symptoms)'
                      : speakingMessageId
                      ? '🔊 Speaking clinical response...'
                      : loading
                      ? '🧠 Consulting healthcare guidelines...'
                      : 'Tap Sphere or Mic to Speak'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {isListening
                      ? 'Speak naturally in English, Telugu, Hindi, or Tamil.'
                      : 'Hands-free clinical voice triage ready. Tap the sphere anytime.'}
                  </p>
                </div>

                {/* Live Transcript / Response preview */}
                {(voiceTranscript || input || latestAssistantMessage) && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 w-full text-left space-y-2 max-h-36 overflow-y-auto">
                    {voiceTranscript && (
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                          You said:
                        </span>
                        <p className="text-xs text-white font-medium mt-0.5">"{voiceTranscript}"</p>
                      </div>
                    )}
                    {latestAssistantMessage && !isListening && (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
                            AI Medical Guidance:
                          </span>
                          <button
                            onClick={() => speakText(latestAssistantMessage.content, latestAssistantMessage.id)}
                            className="text-[10px] text-primary-300 hover:text-white font-bold flex items-center gap-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Replay Audio</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-3 leading-relaxed">
                          {latestAssistantMessage.content.replace(/\*\*/g, '').substring(0, 160)}...
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* One-Tap Voice Demo Buttons */}
                <div className="w-full space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Or tap 1-Click Spoken Questions:
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {quickVoiceDemoQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSimulatedVoiceQuery(q)}
                        className="text-[11px] bg-slate-800/80 hover:bg-primary-900/50 text-slate-300 hover:text-white border border-slate-700 rounded-xl px-2.5 py-1 text-left transition"
                      >
                        🗣️ "{q}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Voice Controls */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center gap-3">
                {speakingMessageId && (
                  <button
                    onClick={stopSpeaking}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-full shadow transition"
                    title="Stop audio"
                  >
                    <VolumeX className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={toggleListening}
                  className={`px-6 py-3 rounded-full font-bold text-xs shadow-xl flex items-center gap-2.5 transition-all ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-700 text-white scale-105'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 animate-pulse" />
                      <span>Stop & Analyze Speech</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Start Speaking (Microphone)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* MODE 2: CHAT MODE WITH DIRECT INTEGRATED VOICE INPUT & AUDIO PLAYBACK */
            <>
              {/* Quick Prompts Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="shrink-0 text-[11px] bg-white hover:bg-primary-50 text-slate-700 hover:text-primary-700 border border-slate-200 hover:border-primary-200 rounded-full px-2.5 py-1 transition whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Real-time Listening Active Banner with Audio Meter */}
              {isListening && (
                <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-ping" />
                    <span className="font-bold">Listening to microphone... Speak now</span>
                    {/* Audio wave bars */}
                    <div className="flex items-center gap-0.5 ml-1">
                      <div className={`w-1 rounded-full bg-emerald-600 ${micVolume > 15 ? 'h-4' : 'h-1.5'} transition-all`} />
                      <div className={`w-1 rounded-full bg-emerald-600 ${micVolume > 35 ? 'h-5' : 'h-1.5'} transition-all`} />
                      <div className={`w-1 rounded-full bg-emerald-600 ${micVolume > 55 ? 'h-4' : 'h-1.5'} transition-all`} />
                    </div>
                  </div>
                  <button
                    onClick={toggleListening}
                    className="text-[11px] font-bold text-rose-700 hover:underline px-2 py-0.5 bg-white border border-rose-200 rounded-lg"
                  >
                    Done Speaking
                  </button>
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] text-xs leading-relaxed rounded-2xl px-3.5 py-2.5 shadow-sm space-y-1.5 ${
                        m.role === 'user'
                          ? 'bg-primary-600 text-white rounded-tr-xs'
                          : m.isEmergency
                          ? 'bg-rose-50 border border-rose-300 text-rose-950 rounded-tl-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line prose-sm">{m.content}</div>

                      {/* Voice Audio Listen Button for Assistant Messages */}
                      {m.role === 'assistant' && (
                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => speakText(m.content, m.id)}
                            className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md transition ${
                              speakingMessageId === m.id
                                ? 'bg-amber-100 text-amber-900 font-bold'
                                : 'text-slate-500 hover:text-primary-700 hover:bg-slate-50'
                            }`}
                          >
                            {speakingMessageId === m.id ? (
                              <>
                                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-ping" />
                                <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                                <span>Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-primary-600" />
                                <span>Listen Aloud</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {m.role === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-primary-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2.5 items-center text-slate-500 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-2xl flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-slate-400 ml-1">Consulting medical guidelines...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 1-Click Spoken Shortcut Chips */}
              <div className="bg-white px-3 pt-2 text-[10px] text-slate-400 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
                <span className="font-bold text-slate-600 shrink-0">Tap to Ask:</span>
                {quickVoiceDemoQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSimulatedVoiceQuery(q)}
                    className="shrink-0 bg-slate-100 hover:bg-primary-50 text-slate-700 hover:text-primary-700 px-2 py-0.5 rounded-full transition"
                  >
                    "{q.substring(0, 28)}..."
                  </button>
                ))}
              </div>

              {/* Input Box with Microphone Voice Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
              >
                {/* Voice Mic Input Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl border transition shadow-xs shrink-0 flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                      : 'bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-700 border-slate-200'
                  }`}
                  title={isListening ? 'Click to stop listening' : 'Click to speak via Microphone'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-primary-600" />}
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? 'Listening to your voice...' : t.aiCopilotPlaceholder}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-xl shadow-md transition shrink-0"
                  title={t.aiCopilotSend}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
