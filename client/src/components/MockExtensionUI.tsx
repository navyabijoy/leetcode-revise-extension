import { motion } from "framer-motion";
import { Check, Brain, Clock, BarChart3, ChevronRight } from "lucide-react";

export function MockExtensionUI() {
  const problems = [
    { title: "Two Sum", difficulty: "Easy", status: "Due Today", color: "text-emerald-400", border: "border-emerald-500/30" },
    { title: "LRU Cache", difficulty: "Medium", status: "3 days", color: "text-yellow-400", border: "border-yellow-500/30" },
    { title: "Trapping Rain Water", difficulty: "Hard", status: "7 days", color: "text-red-400", border: "border-red-500/30" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
      whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative max-w-[320px] mx-auto perspective-1000"
    >
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-blue-600/30 blur-2xl opacity-50 rounded-full" />

      {/* Popup Body */}
      <div className="relative bg-zinc-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold text-white text-sm">LeetRepetition</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>UP FOR REVIEW</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Today</span>
          </div>

          <div className="space-y-2">
            {problems.map((prob, i) => (
              <div 
                key={i}
                className={`p-3 rounded-lg bg-white/5 border ${prob.border} hover:bg-white/10 transition-colors cursor-pointer group`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{prob.title}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${prob.color}`}>{prob.difficulty}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">Review in: <span className="text-white">{prob.status}</span></span>
                  <button className="p-1 rounded bg-white/10 hover:bg-primary hover:text-black transition-colors">
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5">
             <button className="w-full py-2 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-white transition-colors">
               <BarChart3 className="w-3 h-3" />
               View Progress Stats
               <ChevronRight className="w-3 h-3" />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
