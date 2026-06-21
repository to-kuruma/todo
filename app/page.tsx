"use client";

import { useRef, FormEvent } from "react";
import { useTodo, Filter } from "@/hooks/useTodo";
import styles from "./page.module.css";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "すべて", value: "all" },
  { label: "未完了", value: "active" },
  { label: "完了済み", value: "completed" },
];

export default function Page() {
  const { filtered, activeCount, filter, setFilter, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodo();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text) return;
    addTodo(text);
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.focus();
  }

  return (
    <div className={styles.app}>
      <h1>TODO</h1>

      <form className={styles.todoForm} onSubmit={handleSubmit}>
        <input ref={inputRef} type="text" placeholder="新しいタスクを入力..." autoComplete="off" required />
        <button type="submit">追加</button>
      </form>

      <div className={styles.filters}>
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            className={`${styles.filterBtn}${filter === value ? ` ${styles.active}` : ""}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className={styles.todoList}>
        {filtered.length === 0 ? (
          <li className={styles.emptyMessage}>タスクがありません</li>
        ) : (
          filtered.map((todo) => (
            <li key={todo.id} className={`${styles.todoItem}${todo.completed ? ` ${styles.completed}` : ""}`}>
              <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
              <span className={styles.todoText}>{todo.text}</span>
              <button className={styles.deleteBtn} onClick={() => deleteTodo(todo.id)}>✕</button>
            </li>
          ))
        )}
      </ul>

      <div className={styles.footer}>
        <span>{activeCount} 件の未完了タスク</span>
        <button onClick={clearCompleted}>完了済みを削除</button>
      </div>
    </div>
  );
}
