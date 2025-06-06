import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { apiFetch, apiPost } from "../api/client";
import { combineReducers } from "../utils/combineReducers";
import { useThunkReducer, type ThunkAction } from "../utils/useThunkReducer";

// — Types & Actions —
export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

type State = {
  tasks: Task[];
  loading: boolean;
  filter: { showCompleted: boolean };
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "REMOVE_TASK"; payload: number }
  | { type: "TOGGLE_SHOW_COMPLETED" };

// — Domain reducers —
function tasksReducer(state: Task[] | undefined, action: Action): Task[] {
  const currentState = state ?? [];
  switch (action.type) {
    case "SET_TASKS":
      return Array.isArray(action.payload) ? action.payload : [];
    case "ADD_TASK":
      return [...currentState, action.payload];
    case "UPDATE_TASK":
      return currentState.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );
    case "REMOVE_TASK":
      return currentState.filter((t) => t.id !== action.payload);
    default:
      return currentState;
  }
}
function loadingReducer(state = true, action: Action): boolean {
  return action.type === "SET_LOADING" ? action.payload : state;
}
function filterReducer(
  state = { showCompleted: true },
  action: Action
): { showCompleted: boolean } {
  return action.type === "TOGGLE_SHOW_COMPLETED"
    ? { showCompleted: !state.showCompleted }
    : state;
}

// — Combine into rootReducer —
const rootReducer = combineReducers<State, Action>({
  tasks: tasksReducer,
  loading: loadingReducer,
  filter: filterReducer,
});

// — Contexts —
const TasksStateCtx = createContext<Task[] | undefined>(undefined);
const TasksLoadingCtx = createContext<boolean | undefined>(undefined);
const TasksDispatchCtx = createContext<
  { addTask: (title: string) => any } | undefined
>(undefined);
const FilterStateCtx = createContext<{ showCompleted: boolean } | undefined>(
  undefined
);
const FilterDispatchCtx = createContext<{ toggle: () => void } | undefined>(
  undefined
);

// — Provider —
export function TasksProvider({ children }: { children: ReactNode }) {
  const initialState: State = {
    tasks: [],
    loading: true,
    filter: { showCompleted: true }
  };
  const [state, dispatch] = useThunkReducer(rootReducer, initialState);

  // fetch initial tasks
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "SET_LOADING", payload: true });

    apiFetch<Task[]>("/tasks")
      .then((res: any) => {
        if (!cancelled) {
          dispatch({ type: "SET_TASKS", payload: res });
          dispatch({ type: "SET_LOADING", payload: false });
        }
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "SET_LOADING", payload: false });
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  // optimistic add-task thunk
  const addTaskThunk =
    (title: string): ThunkAction<State, Action> =>
    async (dispatch, _getState) => {
      const temp: Task = { id: Date.now(), title, completed: false };
      dispatch({ type: "ADD_TASK", payload: temp });
      try {
        const data = await apiPost<{ title: string }, Task>("/tasks", {
          title,
        });
        dispatch({ type: "UPDATE_TASK", payload: data });
      } catch {
        dispatch({ type: "REMOVE_TASK", payload: temp.id });
      }
    };

  const toggle = () => dispatch({ type: "TOGGLE_SHOW_COMPLETED" });

  // per-slice memoization
  const tasksValue = useMemo(() => state.tasks, [state.tasks]);
  const loadingValue = useMemo(() => state.loading, [state.loading]);
  const tasksDispatch = useMemo(
    () => ({
      addTask: (title: string) => dispatch(addTaskThunk(title)),
    }),
    [dispatch]
  );
  const filterValue = useMemo(() => state.filter, [state.filter]);
  const filterDispatch = useMemo(() => ({ toggle }), [toggle]);

  return (
    <TasksStateCtx.Provider value={tasksValue}>
      <TasksLoadingCtx.Provider value={loadingValue}>
        <TasksDispatchCtx.Provider value={tasksDispatch}>
          <FilterStateCtx.Provider value={filterValue}>
            <FilterDispatchCtx.Provider value={filterDispatch}>
              {children}
            </FilterDispatchCtx.Provider>
          </FilterStateCtx.Provider>
        </TasksDispatchCtx.Provider>
      </TasksLoadingCtx.Provider>
    </TasksStateCtx.Provider>
  );
}

// — Hook APIs —
export function useTasks() {
  const v = useContext(TasksStateCtx);
  if (v === undefined) throw new Error("useTasks must be inside TasksProvider");
  return v;
}
export function useTasksLoading() {
  const v = useContext(TasksLoadingCtx);
  if (v === undefined)
    throw new Error("useTasksLoading must be inside TasksProvider");
  return v;
}
export function useTasksActions() {
  const v = useContext(TasksDispatchCtx);
  if (v === undefined)
    throw new Error("useTasksActions must be inside TasksProvider");
  return v;
}
export function useFilterState() {
  const v = useContext(FilterStateCtx);
  if (v === undefined)
    throw new Error("useFilterState must be inside TasksProvider");
  return v;
}
export function useFilterActions() {
  const v = useContext(FilterDispatchCtx);
  if (v === undefined)
    throw new Error("useFilterActions must be inside TasksProvider");
  return v;
}
