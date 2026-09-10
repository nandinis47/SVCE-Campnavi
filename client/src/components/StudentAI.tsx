/**
 * StudentAI — graph-backed campus guidance companion with hands-free browser speech.
 * Design: Satellite Explorer — bottom-right glass control that stays secondary to the map.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageCircle, Mic, MicOff, Pause, Play, Send, Square, Volume2, VolumeX } from "lucide-react";
import { resolveRouteNodeFromSpokenQuery } from "@/lib/routeGraph";
import type { ShortestRoute } from "@/lib/routeGraph";
import { lostRouteResponse, nextStudentGuidance, routeHandoffMessages } from "@/lib/studentAIGuidance";

interface StudentAIProps {
  destinationLabel: string;
  route: ShortestRoute | null;
  routeRequested: boolean;
}

type RecognitionResult = { isFinal: boolean; 0: { transcript: string } };
type RecognitionEvent = Event & { results: ArrayLike<RecognitionResult> };
type RecognitionErrorEvent = Event & { error?: string };
type BrowserRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type RecognitionConstructor = new () => BrowserRecognition;

type SpeechWindow = Window & {
  SpeechRecognition?: RecognitionConstructor;
  webkitSpeechRecognition?: RecognitionConstructor;
};

const OPENING_MESSAGE = "Follow my lead, and I promise we’ll reach your destination before your motivation completely runs out.";

export default function StudentAI({ destinationLabel, route, routeRequested }: StudentAIProps) {
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [playMode, setPlayMode] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<Array<{ role: "ai" | "user"; text: string }>>([{ role: "ai", text: OPENING_MESSAGE }]);
  const [draft, setDraft] = useState("");
  const previousRouteRef = useRef<string | null>(null);
  const recognitionRef = useRef<BrowserRecognition | null>(null);
  const listenTimerRef = useRef<number | null>(null);
  const playModeRef = useRef(false);
  const speakingRef = useRef(false);
  const pausedRef = useRef(false);
  const mutedRef = useRef(false);
  const listeningRef = useRef(false);
  const inputHandlerRef = useRef<(text: string) => void>(() => undefined);
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const recognitionSupported = typeof window !== "undefined" && Boolean((window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition);

  const routeKey = useMemo(() => route?.nodeIds.join("|") ?? null, [route]);

  const stopListening = useCallback(() => {
    if (listenTimerRef.current !== null) window.clearTimeout(listenTimerRef.current);
    listenTimerRef.current = null;
    const recognition = recognitionRef.current;
    if (recognition) {
      try { recognition.stop(); } catch { recognition.abort(); }
    }
    listeningRef.current = false;
    setListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!speechSupported || mutedRef.current) return;
    stopListening();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 1.02;
    const preferredVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("en"));
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.onstart = () => { speakingRef.current = true; setSpeaking(true); };
    utterance.onend = () => {
      speakingRef.current = false;
      setSpeaking(false);
      if (playModeRef.current && !pausedRef.current && !mutedRef.current) {
        listenTimerRef.current = window.setTimeout(() => inputHandlerRef.current(""), 350);
      }
    };
    utterance.onerror = () => { speakingRef.current = false; setSpeaking(false); };
    window.speechSynthesis.speak(utterance);
  }, [speechSupported, stopListening]);

  const startListening = useCallback(() => {
    if (!playModeRef.current || pausedRef.current || mutedRef.current || speakingRef.current) return;
    const Recognition = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechError("Hands-free listening is unavailable in this browser. Text input remains active.");
      return;
    }
    if (listeningRef.current) return;
    const recognition = recognitionRef.current ?? new Recognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onstart = () => { listeningRef.current = true; setListening(true); setSpeechError(null); };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0]?.transcript ?? "").join(" ").trim();
      if (transcript) inputHandlerRef.current(transcript);
    };
    recognition.onerror = (event) => {
      listeningRef.current = false;
      setListening(false);
      if (event.error !== "no-speech" && event.error !== "aborted") setSpeechError("Microphone listening needs permission. Text input remains active.");
      if (playModeRef.current && !pausedRef.current && !mutedRef.current && !speakingRef.current) {
        listenTimerRef.current = window.setTimeout(startListening, 500);
      }
    };
    recognition.onend = () => {
      listeningRef.current = false;
      setListening(false);
      if (playModeRef.current && !pausedRef.current && !mutedRef.current && !speakingRef.current) {
        listenTimerRef.current = window.setTimeout(startListening, 350);
      }
    };
    try { recognition.start(); } catch { listeningRef.current = false; setListening(false); }
  }, []);

  const processInput = useCallback((text: string) => {
    const normalizedText = text.trim();
    if (!normalizedText) {
      if (playModeRef.current && !pausedRef.current && !mutedRef.current && !speakingRef.current) startListening();
      return;
    }
    stopListening();
    if (pausedRef.current) {
      const response = "Guidance is paused. Double-tap the Student AI icon again when you are ready to continue.";
      setMessages((current) => [...current, { role: "user", text: normalizedText }, { role: "ai", text: response }]);
      return;
    }
    const normalized = normalizedText.toLowerCase();
    const recognizedNode = resolveRouteNodeFromSpokenQuery(normalizedText);
    let response: string;
    if (recognizedNode) {
      const onCurrentRoute = route?.nodeIds.includes(recognizedNode.id);
      response = onCurrentRoute
        ? `I recognize ${recognizedNode.label}. It is part of the documented route. Continue with the next mapped instruction when you reach it.`
        : `I recognize ${recognizedNode.label} as a documented campus node. Select it in the Route Planner if you want directions to this location.`;
    } else if (normalized.includes("yes") || normalized.includes("reached") || normalized.includes("there")) {
      const nextIndex = Math.min(stepIndex + 1, route?.directions.length ?? stepIndex);
      setStepIndex(nextIndex);
      response = nextStudentGuidance(route, nextIndex, destinationLabel);
    } else if (normalized.includes("no") || normalized.includes("didn't") || normalized.includes("didnt") || normalized.includes("lost") || normalized.includes("where")) {
      response = lostRouteResponse(route, stepIndex, destinationLabel);
    } else {
      response = nextStudentGuidance(route, stepIndex, destinationLabel);
    }
    setMessages((current) => [...current, { role: "user", text: normalizedText }, { role: "ai", text: response }]);
    speak(response);
  }, [destinationLabel, route, speak, startListening, stepIndex, stopListening]);

  inputHandlerRef.current = processInput;

  const latestAssistantMessage = useMemo(() => [...messages].reverse().find((message) => message.role === "ai")?.text ?? OPENING_MESSAGE, [messages]);

  useEffect(() => {
    if (!routeRequested || !route || routeKey === previousRouteRef.current) return;
    previousRouteRef.current = routeKey;
    setPaused(false);
    pausedRef.current = false;
    setStepIndex(0);
    const { intro, firstStep } = routeHandoffMessages(route, destinationLabel);
    setMessages((current) => [...current, { role: "ai", text: intro }, { role: "ai", text: firstStep }]);
    speak(`${intro} ${firstStep}`);
  }, [destinationLabel, route, routeKey, routeRequested, speak]);

  useEffect(() => () => {
    playModeRef.current = false;
    if (listenTimerRef.current !== null) window.clearTimeout(listenTimerRef.current);
    recognitionRef.current?.abort();
    if (speechSupported) window.speechSynthesis.cancel();
  }, [speechSupported]);

  const togglePlayMode = () => {
    const next = !playMode;
    setPlayMode(next);
    playModeRef.current = next;
    setOpen(true);
    setSpeechError(null);
    if (next) {
      setPaused(false);
      pausedRef.current = false;
      if (!recognitionSupported) setSpeechError("Hands-free listening is unavailable in this browser. Text input remains active.");
      speak(OPENING_MESSAGE);
      if (!speechSupported) startListening();
    } else {
      stopListening();
      if (speechSupported) window.speechSynthesis.cancel();
      speakingRef.current = false;
      setSpeaking(false);
    }
  };

  const handlePlay = () => {
    if (!speechSupported || muted) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
      pausedRef.current = false;
      if (playModeRef.current && !speakingRef.current) startListening();
      return;
    }
    speak(latestAssistantMessage);
  };

  const handlePause = () => {
    stopListening();
    if (speechSupported && window.speechSynthesis.speaking) window.speechSynthesis.pause();
    setPaused(true);
    pausedRef.current = true;
    setSpeaking(false);
  };

  const handleStop = () => {
    stopListening();
    if (speechSupported) window.speechSynthesis.cancel();
    playModeRef.current = false;
    setPlayMode(false);
    setPaused(false);
    pausedRef.current = false;
    speakingRef.current = false;
    setSpeaking(false);
  };

  const handleMute = () => {
    setMuted((current) => {
      const next = !current;
      mutedRef.current = next;
      if (next) {
        stopListening();
        if (speechSupported) window.speechSynthesis.cancel();
        setSpeaking(false);
      } else if (playModeRef.current && !pausedRef.current) {
        startListening();
      }
      return next;
    });
  };

  const handleDoubleClick = () => {
    if (paused) {
      setPaused(false);
      pausedRef.current = false;
      if (speechSupported) window.speechSynthesis.resume();
      else if (playModeRef.current) startListening();
      return;
    }
    handlePause();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[min(370px,calc(100vw-2rem))] flex-col items-end gap-2">
      {open && <div className="w-full overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/95 text-white shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5"><div className="flex items-center gap-2"><Bot className="h-4 w-4 text-cyan-300" /><span className="text-xs font-semibold tracking-wide">Student AI</span>{listening && <span className="text-[10px] text-cyan-200">Listening…</span>}{speaking && !muted && <span className="text-[10px] text-cyan-200">Speaking…</span>}{paused && <span className="text-[10px] text-amber-200">Paused</span>}</div><div className="flex items-center gap-1"><button type="button" onClick={togglePlayMode} className={`rounded-md px-2 py-1 text-[10px] font-semibold ${playMode ? "bg-cyan-300/25 text-cyan-100" : "bg-white/10 text-white/70"}`} aria-pressed={playMode}>{playMode ? <Mic className="mr-1 inline h-3 w-3" /> : <MicOff className="mr-1 inline h-3 w-3" />}{playMode ? "Play Mode On" : "Play Mode"}</button><button type="button" className="rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white" onClick={handlePlay} aria-label="Play Student AI guidance"><Play className="h-3.5 w-3.5" /></button><button type="button" className="rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white" onClick={handlePause} aria-label="Pause Student AI guidance"><Pause className="h-3.5 w-3.5" /></button><button type="button" className="rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white" onClick={handleStop} aria-label="Stop Student AI guidance"><Square className="h-3.5 w-3.5" /></button><button type="button" className="rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white" onClick={handleMute} aria-label={muted ? "Unmute Student AI" : "Mute Student AI"}>{muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}</button></div></div>
        <div className="max-h-44 space-y-2 overflow-y-auto px-3 py-2.5" aria-live="polite">{messages.slice(-6).map((message, index) => <div key={`${message.role}-${index}`} className={`rounded-xl px-2.5 py-2 text-[11px] leading-relaxed ${message.role === "ai" ? "bg-cyan-300/10 text-cyan-50" : "ml-7 bg-white/10 text-white/75"}`}>{message.text}</div>)}</div>
        <form className="flex items-center gap-2 border-t border-white/10 p-2" onSubmit={(event) => { event.preventDefault(); processInput(draft); setDraft(""); }}><input value={draft} onChange={(event) => setDraft(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-[11px] text-white outline-none placeholder:text-white/35 focus:border-cyan-300/60" placeholder={playMode ? "Speak or type a question…" : "Tell Student AI what happened…"} aria-label="Message Student AI" /><button type="submit" className="rounded-lg bg-cyan-300/15 p-2 text-cyan-100 hover:bg-cyan-300/25" aria-label="Send message"><Send className="h-3.5 w-3.5" /></button></form>
        {speechError && <p className="px-3 pb-2 text-[10px] text-amber-200/80">{speechError}</p>}
        {!speechSupported && <p className="px-3 pb-2 text-[10px] text-amber-200/80">Spoken responses are unavailable in this browser. Text guidance remains active.</p>}
      </div>}
      <button type="button" onClick={() => setOpen((current) => !current)} onDoubleClick={handleDoubleClick} className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-200/50 bg-cyan-300/20 text-cyan-100 shadow-xl shadow-cyan-950/40 backdrop-blur-xl transition hover:bg-cyan-300/30 active:scale-95" aria-label="Open Student AI guidance"><span className="relative"><MessageCircle className="h-6 w-6" />{playMode ? <Mic className="absolute -right-2 -top-2 h-3.5 w-3.5 rounded-full bg-slate-950 text-cyan-200" /> : <Volume2 className="absolute -right-2 -top-2 h-3.5 w-3.5 rounded-full bg-slate-950 text-cyan-200" />}</span></button>
    </div>
  );
}
