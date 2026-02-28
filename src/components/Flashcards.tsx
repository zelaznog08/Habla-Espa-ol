import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { RefreshCw, ChevronRight, ChevronLeft, Volume2, Sparkles, Loader2 } from "lucide-react";
import { generateFlashcards, Flashcard, generateSpeech } from "../services/geminiService";

export default function Flashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState("Viagens");
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = async (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
        // The Gemini TTS API returns raw PCM audio data (16-bit, mono, 24kHz).
        // To play it in the browser using the Audio object, we need to wrap it in a WAV header.
        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const sampleRate = 24000;
        const numChannels = 1;
        const bitsPerSample = 16;
        
        const header = new ArrayBuffer(44);
        const view = new DataView(header);
        
        // RIFF identifier
        view.setUint32(0, 0x52494646, false); // "RIFF"
        // File length
        view.setUint32(4, 36 + bytes.length, true);
        // RIFF type
        view.setUint32(8, 0x57415645, false); // "WAVE"
        // Format chunk identifier
        view.setUint32(12, 0x666d7420, false); // "fmt "
        // Format chunk length
        view.setUint32(16, 16, true);
        // Sample format (1 is PCM)
        view.setUint16(20, 1, true);
        // Channel count
        view.setUint16(22, numChannels, true);
        // Sample rate
        view.setUint32(24, sampleRate, true);
        // Byte rate (sampleRate * numChannels * bitsPerSample/8)
        view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
        // Block align (numChannels * bitsPerSample/8)
        view.setUint16(32, numChannels * (bitsPerSample / 8), true);
        // Bits per sample
        view.setUint16(34, bitsPerSample, true);
        // Data chunk identifier
        view.setUint32(36, 0x64617461, false); // "data"
        // Data chunk length
        view.setUint32(40, bytes.length, true);

        const blob = new Blob([header, bytes], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = (err) => {
          console.error("Audio element error:", err);
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audio.play();
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const newCards = await generateFlashcards(topic);
      setCards(newCards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-serif">Vocabulário Inteligente</h2>
          <p className="text-sm text-zinc-500">Gere flashcards personalizados com IA</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Restaurante, Trabalho..."
            className="flex-1 sm:w-48 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-spanish-red/20"
          />
          <button
            onClick={loadCards}
            disabled={isLoading}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Gerar
          </button>
        </div>
      </div>

      {cards.length > 0 ? (
        <div className="relative max-w-md mx-auto h-[400px] perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                className="w-full h-full relative preserve-3d transition-transform duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white border-2 border-zinc-100 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">{cards[currentIndex].category}</span>
                  <h3 className="text-4xl font-serif text-spanish-red mb-2">{cards[currentIndex].word}</h3>
                  <div 
                    onClick={(e) => playAudio(e, cards[currentIndex].word)}
                    className={`mt-8 p-3 rounded-full transition-all ${isPlaying ? 'bg-spanish-red text-white animate-pulse' : 'bg-zinc-50 text-zinc-400 hover:text-spanish-red hover:bg-spanish-red/10'}`}
                  >
                    <Volume2 size={24} />
                  </div>
                  <p className="mt-auto text-xs text-zinc-300 italic">Clique para ver a tradução</p>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 backface-hidden bg-zinc-900 border-2 border-zinc-800 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center text-white"
                  style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                >
                  <h3 className="text-3xl font-serif text-spanish-yellow mb-4">{cards[currentIndex].translation}</h3>
                  <div className="w-12 h-px bg-zinc-700 mb-6"></div>
                  <p className="text-lg font-light leading-relaxed text-zinc-300 italic group/example cursor-pointer hover:text-white transition-colors"
                     onClick={(e) => playAudio(e, cards[currentIndex].example)}>
                    "{cards[currentIndex].example}"
                    <Volume2 size={14} className="inline-block ml-2 opacity-0 group-hover/example:opacity-100 transition-opacity" />
                  </p>
                  <p className="mt-auto text-xs text-zinc-500 italic">Clique para voltar</p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-6">
            <button onClick={prevCard} className="p-3 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-zinc-500">
              {currentIndex + 1} / {cards.length}
            </span>
            <button onClick={nextCard} className="p-3 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors shadow-sm">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="h-[400px] border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-zinc-400 space-y-4">
          <div className="p-4 bg-zinc-50 rounded-full">
            <RefreshCw size={32} />
          </div>
          <p className="text-sm">Escolha um tema e clique em "Gerar" para começar</p>
        </div>
      )}
    </div>
  );
}
