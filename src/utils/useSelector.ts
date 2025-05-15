// useSelector.ts
import { useContext, useRef, useEffect, useState } from 'react'
import { StateContext } from '../context/TasksContext'

export function useSelector<T>(selector: (state: any) => T): T {
    const { state } = useContext(StateContext)
  
    const selectedRef = useRef<T>(selector(state))
    const [, forceRender] = useState(0)
  
    useEffect(() => {
      const nextSelected = selector(state)
      if (!Object.is(selectedRef.current, nextSelected)) {
        selectedRef.current = nextSelected
        forceRender(n => n + 1)
      }
    }, [state])
  
    return selectedRef.current
  }