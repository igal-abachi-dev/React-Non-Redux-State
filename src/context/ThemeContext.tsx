// src/context/ThemeContext.tsx
import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";

type Theme = "light" | "dark";
type Action = { type: "TOGGLE" };

// — Contexts for state & dispatcher —
const ThemeStateCtx = createContext<Theme | undefined>(undefined);
const ThemeToggleCtx = createContext<(() => void) | undefined>(undefined);

function themeReducer(state: Theme, action: Action): Theme {
  switch (action.type) {
    case "TOGGLE":
      return state === "light" ? "dark" : "light";
    default:
      return state;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, dispatch] = useReducer(themeReducer, "light" as Theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  // Memoize state value to avoid unnecessary re‐renders
  const stateValue = useMemo(() => mode, [mode]);
  // Memoize toggle function so its identity is stable
  const toggle = useCallback(() => dispatch({ type: "TOGGLE" }), []);

  return (
    <ThemeStateCtx.Provider value={stateValue}>
      <ThemeToggleCtx.Provider value={toggle}>
        {children}
      </ThemeToggleCtx.Provider>
    </ThemeStateCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeStateCtx);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

export function useToggleTheme() {
  const ctx = useContext(ThemeToggleCtx);
  if (ctx === undefined) {
    throw new Error("useToggleTheme must be used within a ThemeProvider");
  }
  return ctx;
}
