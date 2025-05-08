import { TasksProvider } from "./context/TasksContext";
import { FilterToggle } from "./components/FilterToggle";
import { AddTaskForm } from "./components/AddTaskForm";
import { TaskList } from "./components/TaskList";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
          <h1>My Tasks</h1>
          <FilterToggle />
          <AddTaskForm />
          <TaskList />
        </div>
      </TasksProvider>
    </ThemeProvider>
  );
}
export default App;
