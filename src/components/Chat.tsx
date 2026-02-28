import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Send, User, Bot, Sparkles, Loader2 } from "lucide-react";
import { getSpanishResponse, ChatMessage } from "../services/geminiService";
import { marked } from "marked";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "model", text: "¡Hola! Soy el Prof. Luis, tu tutor de español. ¿Cómo te llamas y qué te gustaría aprender hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: "user", text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getSpanishResponse(newMessages);
      setMessages([...newMessages, { role: "model", text: response }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "model", text: "Perdón, tuve un problema técnico. ¿Podemos intentar de nuevo?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="p-4 border-bottom border-zinc-100 bg-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-spanish-red flex items-center justify-center text-white shadow-sm">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-medium text-sm">Prof. Luis</h3>
            <p className="text-xs text-zinc-500">Tutor de IA • Online</p>
          </div>
        </div>
        <Sparkles className="text-spanish-yellow" size={18} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-zinc-200" : "bg-spanish-red/10 text-spanish-red"}`}>
                  {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div 
                  className={`p-3 rounded-2xl text-sm ${
                    msg.role === "user" 
                      ? "bg-zinc-900 text-white rounded-tr-none" 
                      : "bg-zinc-100 text-zinc-800 rounded-tl-none"
                  }`}
                >
                  <div 
                    className="markdown-body prose-sm"
                    dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-zinc-100 p-3 rounded-2xl rounded-tl-none">
              <Loader2 className="animate-spin text-zinc-400" size={18} />
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe en español o portugués..."
            className="w-full pl-4 pr-12 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spanish-red/20 focus:border-spanish-red transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-spanish-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
