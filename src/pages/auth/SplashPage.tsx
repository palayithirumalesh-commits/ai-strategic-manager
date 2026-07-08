import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DynamicIcon } from "@/components/shared/DynamicIcon";

export default function SplashPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 4, 100));
    }, 60);
    const timeout = setTimeout(() => navigate("/login"), 2200);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-ink-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 animate-pulse rounded-full bg-violet-600/20 blur-3xl [animation-delay:0.6s]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-violet-500 shadow-2xl shadow-brand-600/30">
          <DynamicIcon name="brain-circuit" className="h-10 w-10 text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">AI Strategic Manager</h1>
          <p className="mt-2 max-w-xs text-sm text-ink-300">
            Transform Data into Intelligent Business Decisions
          </p>
        </div>
        <div className="h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-violet-400 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
