// src/context/ThemeContext.tsx
import React, {
    createContext,
    useReducer,
    useContext,
    type ReactNode,
  } from 'react'
  
  type Theme = 'light' | 'dark'
  type Action = { type: 'TOGGLE' }
  
  const StateCtx = createContext<Theme | undefined>(undefined)
  const DispatchCtx = createContext<React.Dispatch<Action> | undefined>(
    undefined
  )
  
  function themeReducer(state: Theme, action: Action): Theme {
    if (action.type === 'TOGGLE')
      return state === 'light' ? 'dark' : 'light'
    throw new Error('Unknown action')
  }
  
  export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, dispatch] = useReducer(themeReducer, 'light')
    return (
      <StateCtx.Provider value={mode}>
        <DispatchCtx.Provider value={dispatch}>
          {children}
        </DispatchCtx.Provider>
      </StateCtx.Provider>
    )
  }
  
  export function useTheme() {
    const ctx = useContext(StateCtx)
    if (ctx === undefined)
      throw new Error('useTheme must be inside ThemeProvider')
    return ctx
  }
  
  export function useToggleTheme() {
    const dispatch = useContext(DispatchCtx)
    if (!dispatch)
      throw new Error('useToggleTheme must be inside ThemeProvider')
    return () => dispatch({ type: 'TOGGLE' })
  }
  