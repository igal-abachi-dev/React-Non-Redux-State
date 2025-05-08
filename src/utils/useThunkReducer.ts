import { useReducer, useCallback, useRef } from "react";

// A dispatch that can take action objects *or* thunks
export type ThunkAction<S, A> = (
  dispatch: Dispatch<A>,
  getState: () => S
) => any;
export type Dispatch<A> = (action: A | ThunkAction<any, A>) => void;

export function useThunkReducer<S, A>(
  reducer: (state: S | undefined, action: A) => S,
  initialState?: S
): [S, Dispatch<A>] {
  const [state, baseDispatch] = useReducer(reducer, initialState!);
  const stateRef = useRef(state);
  stateRef.current = state;

  const dispatch: Dispatch<A> = useCallback(
    (action) => {
      if (typeof action === "function") {
        // it's a thunk
        (action as ThunkAction<S, A>)(dispatch, () => stateRef.current);
      } else {
        baseDispatch(action as A);
      }
    },
    [baseDispatch]
  );

  return [state, dispatch];
}
