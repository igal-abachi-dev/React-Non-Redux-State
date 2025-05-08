import { useMemo } from "react";
import { useTasks, useTasksLoading } from "../context/TasksContext";
import { useFilterState } from "../context/TasksContext";

export function TaskList() {
  const tasks = useTasks();
  const loading = useTasksLoading();
  const { showCompleted } = useFilterState();

  // derive filtered list
  const visible = useMemo(
    () => (showCompleted ? tasks : tasks.filter((t) => !t.completed)),
    [tasks, showCompleted]
  );

  if (loading) return <p>Loading…</p>;
  return (
    <ul>
      {visible.map((t) => (
        <li key={t.id}>
          <input type="checkbox" checked={t.completed} readOnly /> {t.title}
        </li>
      ))}
    </ul>
  );
}
