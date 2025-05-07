import { TasksProvider } from "./context/TasksContext";
import { FilterToggle } from "./components/FilterToggle";
import { AddTaskForm } from "./components/AddTaskForm";
import { TaskList } from "./components/TaskList";

function App() {
  return (
    <TasksProvider>
      <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
        <h1>My Tasks</h1>
        <FilterToggle />
        <AddTaskForm />
        <TaskList />
      </div>
    </TasksProvider>
  );
}
export default App;
