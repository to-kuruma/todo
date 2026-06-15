# CLAUDE.md

このファイルは、このリポジトリで作業するClaude Codeへのガイダンスです。

## アプリの起動方法

```bash
npm start   # npx serve でアプリを起動し、http://localhost:3000 を開く
```

ビルド手順は不要 — 静的ファイルからそのまま動作します。

## アーキテクチャ

Vanilla JSによるシングルページTODOアプリ（日本語UI）。フレームワーク・バンドラーなし。

- `index.html` — フォーム、フィルターボタン、`<ul id="todo-list">` を含む静的なページ構造
- `script.js` — アプリのロジック全体: 状態管理（`todos[]`, `currentFilter`）、CRUD関数、イベントリスナー
- `style.css` — スタイル全体。アクセントカラーは `#6e8efb`

### 状態モデル

`todos` は `{ id: number, text: string, completed: boolean }` のオブジェクトを持つ配列で、メモリ上に保持されつつ `localStorage` のキー `"todos"` に永続化される。すべての変更操作は「状態を変更 → `saveTodos()` → `render()`」のパターンに従う。`render()` は呼び出されるたびにリストのDOMを全て再構築する。

### script.js内の主要な関数

| 関数 | 役割 |
|---|---|
| `loadTodos()` | 起動時に`localStorage`から読み込む |
| `render()` | `currentFilter`に基づいて`<ul>`を再構築する |
| `addTodo(text)` | `id: Date.now()`で新しいTODOを追加する |
| `toggleTodo(id)` | `completed`フラグを反転させる |
| `deleteTodo(id)` | idで指定したTODOを削除する |
| `clearCompleted()` | 完了済みのTODOをすべて削除する |
