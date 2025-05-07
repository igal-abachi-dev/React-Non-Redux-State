import { useTasks, useTasksLoading } from '../context/TasksContext'
import { useFilterState }             from '../context/TasksContext'

export function TaskList() {
  const tasks       = useTasks()
  const loading     = useTasksLoading()
  const { showCompleted } = useFilterState()

  if (loading) return <p>Loading…</p>

  return (
    <ul>
      {tasks
        .filter(t => showCompleted || !t.completed)
        .map(t => (
          <li key={t.id}>
            <input type="checkbox" checked={t.completed} readOnly /> {t.title}
          </li>
        ))}
    </ul>
  )
}
