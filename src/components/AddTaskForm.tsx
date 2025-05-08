import React, { useState } from "react";
import { useTasksActions } from "../context/TasksContext";

export function AddTaskForm() {
  const [title, setTitle] = useState("");
  const { addTask } = useTasksActions();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title);
    setTitle("");
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task…"
      />
      <button type="submit">Add</button>
    </form>
  );
}
