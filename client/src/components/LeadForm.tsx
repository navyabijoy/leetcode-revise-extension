import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema } from "@shared/schema";
import { useCreateLead } from "@/hooks/use-leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { z } from "zod";

type FormData = z.infer<typeof insertLeadSchema>;

export function LeadForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(insertLeadSchema),
  });

  const { mutate, isPending, isSuccess } = useCreateLead();

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-2xl border border-primary/20 text-center"
          >
            <CheckCircle2 className="w-12 h-12 text-primary mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">You're in!</h3>
            <p className="text-muted-foreground">Thanks for joining the waitlist.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                {...register("email")}
                placeholder="developer@example.com"
                className="pl-10 h-12 rounded-xl bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                disabled={isPending}
              />
              {errors.email && (
                <span className="absolute -bottom-6 left-0 text-xs text-destructive font-medium ml-1">
                  {errors.email.message}
                </span>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isPending}
              className="h-12 px-8 rounded-xl font-semibold bg-white text-black hover:bg-white/90 transition-all shadow-lg hover:shadow-white/20"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Notify Me"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
      
      <p className="mt-4 text-xs text-center text-muted-foreground/60">
        We respect your inbox. No spam, ever.
      </p>
    </div>
  );
}
