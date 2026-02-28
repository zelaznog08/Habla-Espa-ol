import { motion } from "motion/react";
import { useState } from "react";
import { 
  BookOpen, 
  MessageSquare, 
  Layers, 
  Globe, 
  Menu, 
  X, 
  ArrowRight,
  Sparkles,
  Search
} from "lucide-react";
import Chat from "./components/Chat";
import Flashcards from "./components/Flashcards";
import GrammarGuide from "./components/GrammarGuide";

type Tab = "home" | "tutor" | "flashcards" | "grammar";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { id: "home", name: "Início", icon: Globe },
    { id: "tutor", name: "Tutor IA", icon: MessageSquare },
    { id: "flashcards", name: "Flashcards", icon: Layers },
    { id: "grammar", name: "Gramática", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex flex-col cursor-pointer" onClick={() => setActiveTab("home")}>
              <div className="flex items-center gap-2">
                <img src="https://i.ibb.co/ksWDhYfH/logomarcafin.png" alt="Logo" className="w-10 h-10 object-contain" />
                <span className="text-xl font-serif font-semibold tracking-tight">Espanhol Online</span>
              </div>
              <div className="text-[10px] text-zinc-400 font-medium ml-12 -mt-1 hidden sm:block">
                Prof. Luis González • (31) 9 9954 9579
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    activeTab === item.id ? "text-spanish-red" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {item.name}
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-spanish-red"
                    />
                  )}
                </button>
              ))}
              <button className="px-4 py-2 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm">
                Começar Agora
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-zinc-500">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-zinc-100 p-4 space-y-2"
          >
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 ${
                  activeTab === item.id ? "bg-spanish-red/5 text-spanish-red" : "text-zinc-500"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </button>
            ))}
          </motion.div>
        )}
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === "home" && (
          <div className="space-y-20 py-10">
            {/* Hero Section - Editorial Recipe */}
            <section className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-spanish-yellow/10 text-spanish-yellow rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={12} />
                  Aprendizado Inteligente
                </div>
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif leading-[0.9] tracking-tighter">
                  Habla <span className="italic text-spanish-red">Español</span> com Confiança.
                </h1>
                <p className="text-lg text-zinc-500 max-w-lg leading-relaxed">
                  Uma experiência imersiva que combina a elegância do design moderno com o poder da Inteligência Artificial para acelerar sua fluência.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => setActiveTab("tutor")}
                    className="px-8 py-4 bg-spanish-red text-white rounded-2xl font-medium hover:bg-red-700 transition-all shadow-lg shadow-spanish-red/20 flex items-center gap-2 group"
                  >
                    Conversar con el Prof. Luis
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setActiveTab("flashcards")}
                    className="px-8 py-4 bg-white border border-zinc-200 rounded-2xl font-medium hover:bg-zinc-50 transition-all"
                  >
                    Praticar Vocabulário
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-[40px] overflow-hidden shadow-2xl"
              >
                <img
                  src="https://i.ibb.co/PfCYtYW/Logo-1.png"
                  alt="Spanish Culture"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                  <p className="text-xs font-mono uppercase tracking-widest opacity-70">Destaque Cultural</p>
                  <h3 className="text-2xl font-serif italic">"La vida es un viaje, no un destino."</h3>
                </div>
              </motion.div>
            </section>

            {/* Features - Bento Grid */}
            <section className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-zinc-900 rounded-[32px] p-8 text-white flex flex-col justify-between min-h-[300px] group overflow-hidden relative">
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="text-spanish-yellow" />
                  </div>
                  <h3 className="text-3xl font-serif">Tutor Pessoal 24/7</h3>
                  <p className="text-zinc-400 max-w-sm">
                    O Prof. Luis, nosso tutor de IA, está pronto para conversar, corrigir sua gramática e ensinar gírias locais a qualquer hora.
                  </p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-spanish-red/20 blur-3xl rounded-full group-hover:bg-spanish-red/30 transition-all"></div>
              </div>

              <div className="bg-white border border-zinc-100 rounded-[32px] p-8 flex flex-col justify-between min-h-[300px] shadow-sm">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center">
                    <Layers className="text-spanish-red" />
                  </div>
                  <h3 className="text-2xl font-serif">Flashcards Dinâmicos</h3>
                  <p className="text-zinc-500 text-sm">
                    Memorização espaçada potencializada por IA. Gere cards sobre qualquer tema instantaneamente.
                  </p>
                </div>
                <button onClick={() => setActiveTab("flashcards")} className="text-spanish-red font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Explorar <ArrowRight size={14} />
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === "tutor" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-serif">Conversa com o Prof. Luis</h2>
              <p className="text-zinc-500">Pratique seu espanhol em um ambiente seguro e interativo.</p>
            </div>
            <Chat />
          </div>
        )}

        {activeTab === "flashcards" && (
          <div className="max-w-4xl mx-auto">
            <Flashcards />
          </div>
        )}

        {activeTab === "grammar" && (
          <GrammarGuide />
        )}
      </main>

      <footer className="border-t border-zinc-100 py-12 bg-zinc-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2 space-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <img src="https://i.ibb.co/ksWDhYfH/logomarcafin.png" alt="Logo" className="w-8 h-8 object-contain" />
                  <span className="text-lg font-serif font-semibold">Espanhol Online</span>
                </div>
                <div className="text-xs text-zinc-400 font-medium ml-10">
                  Prof. Luis González • (31) 9 9954 9579
                </div>
              </div>
              <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                Transformando o aprendizado de idiomas através da tecnologia e do design. Feito para quem busca fluência real.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400">Plataforma</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><button onClick={() => setActiveTab("tutor")} className="hover:text-spanish-red transition-colors">Tutor IA</button></li>
                <li><button onClick={() => setActiveTab("flashcards")} className="hover:text-spanish-red transition-colors">Flashcards</button></li>
                <li><button onClick={() => setActiveTab("grammar")} className="hover:text-spanish-red transition-colors">Gramática</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400">Social</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><a href="https://www.instagram.com/espanholonlineoficial/" target="_blank" rel="noopener noreferrer" className="hover:text-spanish-red transition-colors">Instagram</a></li>
                <li><a href="https://www.youtube.com/@aulasonlinedeespanhol" target="_blank" rel="noopener noreferrer" className="hover:text-spanish-red transition-colors">YouTube</a></li>
                <li><a href="https://www.facebook.com/groups/espanholonline" target="_blank" rel="noopener noreferrer" className="hover:text-spanish-red transition-colors">Comunidade</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-400">© 2026 Espanhol Online. Todos os direitos reservados.</p>
            <div className="flex gap-6 text-xs text-zinc-400">
              <a href="#" className="hover:text-zinc-900">Privacidade</a>
              <a href="#" className="hover:text-zinc-900">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
