import { useFilterState, useFilterActions } from "../context/TasksContext";

export function FilterToggle() {
  const { showCompleted } = useFilterState();
  const { toggle } = useFilterActions();
  return (
    <button onClick={toggle} style={{ marginBottom: 16 }}>
      {showCompleted ? "Hide" : "Show"} Completed Tasks
    </button>
  );
}
