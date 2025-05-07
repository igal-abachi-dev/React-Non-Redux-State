export function combineReducers<S, A>(
    reducers: { [K in keyof S]: (slice: S[K] | undefined, action: A) => S[K] }
  ): (state: S | undefined, action: A) => S {
    const keys = Object.keys(reducers) as (keyof S)[]
    return function rootReducer(state: S | undefined, action: A): S {
      const prev = state || ({} as S)
      let changed = false
      const next = {} as S
  
      for (const key of keys) {
        const sliceReducer  = reducers[key]
        const previousSlice = prev[key]
        const newSlice      = sliceReducer(previousSlice, action)
  
        if (newSlice === undefined) {
          const actionType = (action as any).type
          throw new Error(
            `Reducer for key "${String(key)}" returned undefined for action "${actionType}". ` +
            `Ensure initial state is returned when slice is undefined and default case returns previous state.`
          )
        }
  
        next[key] = newSlice
        if (newSlice !== previousSlice) changed = true
      }
  
      return changed || state === undefined ? next : prev
    }
  }