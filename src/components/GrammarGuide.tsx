import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Search, ArrowRight, ArrowLeft, Loader2, BookOpen, Sparkles } from "lucide-react";
import { generateGrammarExplanation } from "../services/geminiService";
import { marked } from "marked";

interface GrammarTopic {
  title: string;
  level: string;
  duration: string;
}

const PRESET_TOPICS: GrammarTopic[] = [
  { title: "Verbos Regulares", level: "Iniciante", duration: "10 min" },
  { title: "Ser vs Estar", level: "Iniciante", duration: "15 min" },
  { title: "Pretérito Indefinido", level: "Intermediário", duration: "20 min" },
  { title: "Subjuntivo", level: "Avançado", duration: "30 min" },
];

export default function GrammarGuide() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectTopic = async (topic: string) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setExplanation("");
    try {
      const result = await generateGrammarExplanation(topic);
      setExplanation(result);
    } catch (error) {
      console.error(error);
      setExplanation("Error al cargar la explicación. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTopics = PRESET_TOPICS.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <AnimatePresence mode="wait">
        {!selectedTopic ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-6">
                <h2 className="text-5xl font-serif leading-tight">Guia de <span className="italic text-spanish-red">Gramática</span> Essencial</h2>
                <p className="text-zinc-500 leading-relaxed">
                  Entenda as estruturas fundamentais do espanhol com explicações claras e exemplos práticos focados em falantes de português.
                </p>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchQuery && handleSelectTopic(searchQuery)}
                    placeholder="Buscar tópico (ex: Verbo Ser, Porquês...)"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spanish-red/20"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => handleSelectTopic(searchQuery)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-spanish-red text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-72 space-y-4">
                <div className="p-6 bg-zinc-900 text-white rounded-3xl space-y-4">
                  <h4 className="font-serif italic text-lg text-spanish-yellow">Dica do Dia</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    "Muy" é usado antes de adjetivos e advérbios. "Mucho" é usado antes de substantivos ou depois de verbos.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {filteredTopics.map((topic, i) => (
                <div 
                  key={i} 
                  onClick={() => handleSelectTopic(topic.title)}
                  className="group p-6 bg-white border border-zinc-100 rounded-3xl hover:border-spanish-red/30 transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">{topic.level}</span>
                    <span className="text-[10px] font-mono text-zinc-400">{topic.duration}</span>
                  </div>
                  <h3 className="text-xl font-serif group-hover:text-spanish-red transition-colors">{topic.title}</h3>
                  <div className="mt-4 flex justify-end">
                    <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-spanish-red group-hover:text-white transition-all">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
              {filteredTopics.length === 0 && searchQuery && (
                <div 
                  onClick={() => handleSelectTopic(searchQuery)}
                  className="sm:col-span-2 group p-8 bg-spanish-red/5 border border-dashed border-spanish-red/20 rounded-3xl text-center cursor-pointer hover:bg-spanish-red/10 transition-all"
                >
                  <Sparkles className="mx-auto mb-4 text-spanish-red" size={32} />
                  <h3 className="text-xl font-serif mb-2">Gerar explicação para "{searchQuery}"</h3>
                  <p className="text-sm text-zinc-500">Nossa IA criará uma aula personalizada para você agora mesmo.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="explanation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <button 
              onClick={() => setSelectedTopic(null)}
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-spanish-red transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar para a lista
            </button>

            <div className="bg-white border border-zinc-100 rounded-[40px] p-8 md:p-12 shadow-sm min-h-[600px]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-spanish-red/10 text-spanish-red rounded-2xl flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-3xl font-serif">{selectedTopic}</h2>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-zinc-400 space-y-4">
                  <Loader2 className="animate-spin" size={48} />
                  <p className="font-serif italic">O Prof. Luis está preparando sua aula...</p>
                </div>
              ) : (
                <div 
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: marked.parse(explanation) }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
