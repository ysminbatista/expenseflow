"use client";

import { CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Kind = "success" | "error" | "info";
type ToastItem = { id: number; message: string; kind: Kind };

const ToastContext = createContext<(message: string, kind?: Kind) => void>(
  () => {},
);

const STYLES: Record<Kind, { box: string; icon: LucideIcon; color: string }> = {
  success: {
    box: "border-emerald-200 bg-white",
    icon: CircleCheck,
    color: "text-emerald-500",
  },
  error: {
    box: "border-rose-200 bg-white",
    icon: TriangleAlert,
    color: "text-rose-500",
  },
  info: {
    box: "border-indigo-200 bg-white",
    icon: Info,
    color: "text-indigo-500",
  },
};

// Avisos rápidos que aparecem no canto da tela e somem sozinhos
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const toast = useCallback((message: string, kind: Kind = "success") => {
    const id = nextId.current++;
    setItems((current) => [...current, { id, message, kind }]);
    const timer = setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
      timers.current.delete(timer);
    }, 3800);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {items.map((item) => {
          const style = STYLES[item.kind];
          const Icon = style.icon;
          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex max-w-sm animate-toast-in items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium text-gray-800 shadow-lg ${style.box}`}
            >
              <Icon
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 ${style.color}`}
              />
              {item.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
