import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

function getInput() {
  return screen.getByPlaceholderText("新しいタスクを入力...");
}

async function addTask(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(getInput(), text);
  await user.click(screen.getByRole("button", { name: "追加" }));
}

beforeEach(() => {
  localStorage.clear();
});

describe("TODOアプリ", () => {
  it("初期状態ではタスクが存在せず「タスクがありません」と表示される", () => {
    render(<Page />);
    expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    expect(screen.getByText("0 件の未完了タスク")).toBeInTheDocument();
  });

  it("タスクを追加すると一覧に表示され、未完了件数が増える", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await addTask(user, "牛乳を買う");

    expect(screen.getByText("牛乳を買う")).toBeInTheDocument();
    expect(screen.getByText("1 件の未完了タスク")).toBeInTheDocument();
    expect(screen.queryByText("タスクがありません")).not.toBeInTheDocument();
  });

  it("空文字や空白のみの入力ではタスクが追加されない", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.type(getInput(), "   ");
    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    expect(screen.getByText("0 件の未完了タスク")).toBeInTheDocument();
  });

  it("タスク追加後に入力欄が空になる", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await addTask(user, "レポートを書く");

    expect(getInput()).toHaveValue("");
  });

  it("チェックボックスをクリックすると完了状態になり、未完了件数が減る", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await addTask(user, "部屋の掃除");
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
    expect(screen.getByText("1 件の未完了タスク")).toBeInTheDocument();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByText("0 件の未完了タスク")).toBeInTheDocument();
  });

  it("完了済みのチェックを外すと未完了に戻る", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await addTask(user, "部屋の掃除");
    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(screen.getByText("1 件の未完了タスク")).toBeInTheDocument();
  });

  it("削除ボタンを押すとそのタスクだけが一覧から消える", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await addTask(user, "牛乳を買う");
    await addTask(user, "レポートを書く");

    const deleteButtons = screen.getAllByRole("button", { name: "✕" });
    await user.click(deleteButtons[0]);

    expect(screen.queryByText("牛乳を買う")).not.toBeInTheDocument();
    expect(screen.getByText("レポートを書く")).toBeInTheDocument();
  });

  it("「未完了」フィルターでは完了済みタスクが表示されない", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await addTask(user, "牛乳を買う");
    await addTask(user, "レポートを書く");
    await user.click(screen.getAllByRole("checkbox")[0]);

    await user.click(screen.getByRole("button", { name: "未完了" }));

    expect(screen.queryByText("牛乳を買う")).not.toBeInTheDocument();
    expect(screen.getByText("レポートを書く")).toBeInTheDocument();
  });

  it("「完了済み」フィルターでは未完了タスクが表示されない", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await addTask(user, "牛乳を買う");
    await addTask(user, "レポートを書く");
    await user.click(screen.getAllByRole("checkbox")[0]);

    await user.click(screen.getByRole("button", { name: "完了済み" }));

    expect(screen.getByText("牛乳を買う")).toBeInTheDocument();
    expect(screen.queryByText("レポートを書く")).not.toBeInTheDocument();
  });

  it("フィルターを「すべて」に戻すと全タスクが再表示される", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await addTask(user, "牛乳を買う");
    await addTask(user, "レポートを書く");
    await user.click(screen.getAllByRole("checkbox")[0]);

    await user.click(screen.getByRole("button", { name: "完了済み" }));
    await user.click(screen.getByRole("button", { name: "すべて" }));

    expect(screen.getByText("牛乳を買う")).toBeInTheDocument();
    expect(screen.getByText("レポートを書く")).toBeInTheDocument();
  });

  it("「完了済みを削除」ボタンで完了済みタスクのみ削除される", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await addTask(user, "牛乳を買う");
    await addTask(user, "レポートを書く");
    await user.click(screen.getAllByRole("checkbox")[0]);

    await user.click(screen.getByRole("button", { name: "完了済みを削除" }));

    expect(screen.queryByText("牛乳を買う")).not.toBeInTheDocument();
    expect(screen.getByText("レポートを書く")).toBeInTheDocument();
  });

  it("完了済みタスクが無い状態で「完了済みを削除」を押しても何も変わらない", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await addTask(user, "牛乳を買う");
    await user.click(screen.getByRole("button", { name: "完了済みを削除" }));

    expect(screen.getByText("牛乳を買う")).toBeInTheDocument();
    expect(screen.getByText("1 件の未完了タスク")).toBeInTheDocument();
  });

  it("追加したタスクはlocalStorageに保存される", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await addTask(user, "牛乳を買う");

    const stored = JSON.parse(localStorage.getItem("todos") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].text).toBe("牛乳を買う");
    expect(stored[0].completed).toBe(false);
  });

  it("再マウント時にlocalStorageの内容が復元される", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Page />);

    await addTask(user, "牛乳を買う");
    unmount();

    render(<Page />);

    expect(await screen.findByText("牛乳を買う")).toBeInTheDocument();
    expect(screen.getByText("1 件の未完了タスク")).toBeInTheDocument();
  });
});
