import { useEffect } from "react";
import { useAppSelector } from "@/app/hooks";

/**
 * Tailwind's `dark:` variants only activate when an ancestor has the
 * `dark` class. Redux state alone doesn't touch the DOM, so this hook
 * mirrors `ui.darkMode` onto <html class="dark"> whenever it changes.
 */
export function useDarkModeSync() {
  const darkMode = useAppSelector((s) => s.ui.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);
}
