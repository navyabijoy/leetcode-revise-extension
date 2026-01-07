import { motion } from "framer-motion";
import { Brain, Zap, Shield, TrendingUp, Download, Chrome, Github } from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { LeadForm } from "@/components/LeadForm";
import { MockExtensionUI } from "@/components/MockExtensionUI";
import { Button } from "@/components/ui/button";

export default function Home() {
  const handleDownload = () => {
    window.open("https://github.com", "_blank"); // Mock link for now
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <Brain className="text-primary w-6 h-6" />
            LeetCode SRS
          </div>
          <div className="flex items-center gap-4">
             <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-white transition-colors hidden sm:block">
               <Github className="w-5 h-5" />
             </a>
             <Button 
               size="sm" 
               className="bg-primary text-black hover:bg-primary/90 font-semibold"
               onClick={handleDownload}
             >
               Download Beta
             </Button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 relative">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Now in Public Beta
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-6 text-white">
                Never forget a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">solution again.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Master algorithmic patterns with scientifically-proven spaced repetition. 
                Our Chrome extension automatically tracks your LeetCode progress and schedules reviews at optimal intervals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button 
                size="lg" 
                className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-base shadow-xl shadow-white/10 hover:scale-[1.02] transition-all"
                onClick={handleDownload}
              >
                <Chrome className="mr-2 w-5 h-5" />
                Add to Chrome
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 rounded-2xl bg-transparent border-white/10 hover:bg-white/5 text-white font-medium text-base transition-all"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How it works
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 text-sm text-muted-foreground/60"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-[10px] font-mono text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p>Trusted by 500+ developers</p>
            </motion.div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-20" />
            <MockExtensionUI />
          </div>

        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto mb-32">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">Built for High Performance</h2>
            <p className="text-muted-foreground">
              Designed to help you crack FAANG interviews without the burnout. 
              We handle the scheduling, you focus on the coding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6" />}
              title="Spaced Repetition"
              description="The forgetting curve is real. We use the optimized schedule (1, 3, 7, 21, 45, 90 days) to lock patterns into long-term memory."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6" />}
              title="Auto-Detection"
              description="Zero friction. The extension automatically detects when you solve a problem and adds it to your review queue instantly."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6" />}
              title="Privacy First"
              description="Your data stays on your machine. We use Chrome's local storage so your study habits remain completely private."
              delay={0.3}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          >
            {/* Background accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[400px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                <Download className="w-8 h-8 text-black" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                Ready to master LeetCode?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join the waitlist to get early access to new features and community study groups.
              </p>

              <LeadForm />
            </div>
          </motion.div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4 font-bold text-white opacity-50">
            <Brain className="w-4 h-4" />
            LeetCode SRS
          </div>
          <p>© {new Date().getFullYear()} Spaced Repetition for LeetCode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
