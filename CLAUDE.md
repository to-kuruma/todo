# CLAUDE.md

このファイルは、このリポジトリで作業するClaude Codeへのガイダンスです。

## アプリの起動方法

```bash
npm run dev     # 開発サーバー起動 → http://localhost:3000
npm run build   # 本番ビルド
npm start       # 本番サーバー起動
```

## アーキテクチャ

Next.js (App Router) + TypeScript + CSS Modules による日本語UIのTODOアプリ。
データはブラウザの`localStorage`のみに保存され、サーバーへの送信はない。

```
app/
  layout.tsx        — HTMLレイアウト、メタ情報
  page.tsx          — メインページ（"use client"、UIコンポーネント）
  page.module.css   — TODOアプリのスタイル（CSS Modules）
  globals.css       — グローバルスタイル（背景グラデーションなど）
hooks/
  useTodo.ts        — 状態管理・localStorage永続化のカスタムフック
```

## 状態モデル

`useTodo` フック内で `todos: Todo[]` と `filter: Filter` を `useState` で管理。
`Todo` の型は `{ id: number, text: string, completed: boolean }`。
すべての変更操作は `save()` 関数を通じてstateとlocalStorageを同期する。

### useTodo の主なAPI

| 関数・値 | 役割 |
|---|---|
| `filtered` | 現在のフィルターを適用したTODO一覧 |
| `activeCount` | 未完了タスク数 |
| `filter` / `setFilter` | フィルター状態（`all` / `active` / `completed`） |
| `addTodo(text)` | `id: Date.now()`で新しいTODOを追加する |
| `toggleTodo(id)` | `completed`フラグを反転させる |
| `deleteTodo(id)` | idで指定したTODOを削除する |
| `clearCompleted()` | 完了済みのTODOをすべて削除する |
