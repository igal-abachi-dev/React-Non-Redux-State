//SpinnerContext.tsx
import {
    createContext,
    useContext,
    useState,
    useRef,
    type ReactNode,
    useCallback,
    useMemo,
    useEffect,
  } from 'react';
  
  type SpinnerContextState = {
    loading: boolean;
    pendingCount: number;
  };
  
  type SpinnerActions = {
    start: () => void;
    stop: () => void;
  };
  
  const SpinnerStateCtx = createContext<SpinnerContextState | undefined>(undefined);
  const SpinnerDispatchCtx = createContext<SpinnerActions | undefined>(undefined);
  
  export function SpinnerProvider({
    children,
    debounceMs = 150,
    minVisibleMs = 400,
  }: {
    children: ReactNode;
    debounceMs?: number;
    minVisibleMs?: number;
  }) {
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(false);
  
    const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const spinnerShownAt = useRef<number | null>(null);
  
    const start = useCallback(() => {
      setPendingCount((count) => {
        if (count === 0) {
          clearTimeout(hideTimerRef.current!);
          showTimerRef.current = setTimeout(() => {
            setLoading(true);
            spinnerShownAt.current = Date.now();
          }, debounceMs);
        }
        return count + 1;
      });
    }, [debounceMs]);
  
    const stop = useCallback(() => {
      setPendingCount((count) => {
        const next = count - 1;
        if (next === 0) {
          clearTimeout(showTimerRef.current!);
          const shownAt = spinnerShownAt.current;
          const now = Date.now();
          if (shownAt && now - shownAt < minVisibleMs) {
            const delay = minVisibleMs - (now - shownAt);
            hideTimerRef.current = setTimeout(() => {
              setLoading(false);
              spinnerShownAt.current = null;
            }, delay);
          } else {
            setLoading(false);
            spinnerShownAt.current = null;
          }
        }
        return next;
      });
    }, [minVisibleMs]);
  
    // Optional: sync to DOM
    useEffect(() => {
      if (loading) {
        document.body.setAttribute('data-spinner', 'on');
      } else {
        document.body.removeAttribute('data-spinner');
      }
    }, [loading]);
  
    const stateValue = useMemo(() => ({ loading, pendingCount }), [loading, pendingCount]);
    const dispatchValue = useMemo(() => ({ start, stop }), [start, stop]);

    useEffect(() => {
        return () => {
          clearTimeout(showTimerRef.current!);
          clearTimeout(hideTimerRef.current!);
        };
      }, []);

      
    return (
      <SpinnerStateCtx.Provider value={stateValue}>
        <SpinnerDispatchCtx.Provider value={dispatchValue}>
          {children}
        </SpinnerDispatchCtx.Provider>
      </SpinnerStateCtx.Provider>
    );
  }
  
  export function useSpinnerState() {
    const ctx = useContext(SpinnerStateCtx);
    if (!ctx) throw new Error('useSpinnerState must be used within SpinnerProvider');
    return ctx;
  }
  
  export function useSpinnerActions() {
    const ctx = useContext(SpinnerDispatchCtx);
    if (!ctx) throw new Error('useSpinnerActions must be used within SpinnerProvider');
    return ctx;
  }