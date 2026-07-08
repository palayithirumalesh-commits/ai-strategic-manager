import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
}

interface ToastContextValue {
  toasts: ToastData[];
  toast: (data: Omit<ToastData, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const toast = React.useCallback((data: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...data, id }]);
  }, []);

  const remove = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      <ToastPrimitive.Provider swipeDirection="right" duration={4000}>
        {children}
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            onOpenChange={(open) => !open && remove(t.id)}
            className={cn(
              "glass pointer-events-auto grid grid-cols-[1fr_auto] items-start gap-2 rounded-xl p-4 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full",
              t.variant === "success" && "border-l-4 border-l-success-500",
              t.variant === "destructive" && "border-l-4 border-l-danger-500",
              (!t.variant || t.variant === "default") && "border-l-4 border-l-brand-500"
            )}
          >
            <div>
              <ToastPrimitive.Title className="text-sm font-semibold text-ink-800 dark:text-white">
                {t.title}
              </ToastPrimitive.Title>
              {t.description && (
                <ToastPrimitive.Description className="mt-1 text-xs text-ink-400">
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close className="rounded p-1 text-ink-400 hover:bg-ink-100 dark:hover:bg-white/10">
              <X className="h-3.5 w-3.5" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] m-4 flex w-full max-w-sm flex-col gap-2 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
