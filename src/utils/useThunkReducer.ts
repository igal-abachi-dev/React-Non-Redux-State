import { useReducer, useCallback, useRef } from 'react'

export type ThunkAction<S, A> = (dispatch: Dispatch<A>, getState: () => S) => any
export type Dispatch<A> = (action: A | ThunkAction<any, A>) => any

export function useThunkReducer<S, A>(
  reducer: (state: S | undefined, action: A) => S,
  initialState?: S
): [S, Dispatch<A>] {
  const [state, baseDispatch] = useReducer(reducer, initialState as S)
  const stateRef = useRef(state)
  stateRef.current = state

  const dispatch: Dispatch<A> = useCallback((action) => {
    if (typeof action === 'function') {
      return (action as ThunkAction<S, A>)(dispatch, () => stateRef.current)
    } else {
      return baseDispatch(action as A)
    }
  }, [baseDispatch])

  return [state, dispatch]
}