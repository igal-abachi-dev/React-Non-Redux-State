import { useEffect } from "react";
import {
  useThunkReducer,
  type ThunkAction,
  type Dispatch,
} from "../utils/useThunkReducer";
import { apiFetch } from "../api/client";

// 1) Generic State & Actions
export type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type FetchAction<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T }
  | { type: "FETCH_ERROR"; payload: string };

// 2) Generic reducer
function fetchReducer<T>(
  state: FetchState<T> | undefined,
  action: FetchAction<T>
): FetchState<T> {
  if (!state) {
    return { data: null, loading: false, error: null };
  }
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// 3) The generic hook
export function useFetchData<T>(
  url: string
): [FetchState<T>, Dispatch<FetchAction<T>>] {
  const [state, dispatch] = useThunkReducer<FetchState<T>, FetchAction<T>>(
    fetchReducer,
    { data: null, loading: false, error: null }
  );

  useEffect(() => {
    // 4) Thunk with generic T
    const fetchThunk: ThunkAction<FetchState<T>, FetchAction<T>> = async (
      dispatch,
      _getState
    ) => {
      dispatch({ type: "FETCH_START" });
      try {
        const json = await apiFetch<T>(url);
        dispatch({ type: "FETCH_SUCCESS", payload: json });
      } catch (err: any) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    dispatch(fetchThunk);
  }, [url, dispatch]);

  return [state, dispatch];
}
