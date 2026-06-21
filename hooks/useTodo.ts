"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "todos";

export type Filter = "all" | "active" | "completed";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function useTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTodos(JSON.parse(stored));
    } catch {
      // localStorage が使えない環境では無視
    }
  }, []);

  function save(next: Todo[]) {
    setTodos(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  function addTodo(text: string) {
    save([...todos, { id: Date.now(), text, completed: false }]);
  }

  function toggleTodo(id: number) {
    save(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function deleteTodo(id: number) {
    save(todos.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    save(todos.filter((t) => !t.completed));
  }

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return { filtered, activeCount, filter, setFilter, addTodo, toggleTodo, deleteTodo, clearCompleted };
}
