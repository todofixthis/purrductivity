# Purrductivity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal cat-themed todo list app with add and delete task functionality.

**Architecture:** Single-page React app with component state managed in App; no backend or persistence. Three focused components (AddTask, TaskItem, TaskList) each with unit tests, wired together in App.

**Worktree:** `/Users/phx/Documents/purrductivity` [main]

**Tech Stack:** Vite 6, React 19, TypeScript, Tailwind CSS v4, Vitest, React Testing Library

> **⚠️ Intentional Omission:** Marking tasks as complete is deliberately **not** implemented. This feature gap exists to be filled live during a coding agent demo.

---

## File Map

| File | Responsibility |
|------|----------------|
| `vite.config.ts` | Vite + Tailwind v4 plugin + Vitest configuration |
| `src/index.css` | Tailwind CSS v4 `@import` |
| `src/test-setup.ts` | Registers `@testing-library/jest-dom` matchers |
| `src/types.ts` | `Task` type |
| `src/App.tsx` | Root component; owns `tasks` state; exposes `addTask` and `deleteTask` |
| `src/App.test.tsx` | Integration tests: full add and delete flows |
| `src/components/AddTask.tsx` | Controlled input + submit button; calls `onAdd(title)` |
| `src/components/AddTask.test.tsx` | Unit tests for AddTask |
| `src/components/TaskItem.tsx` | Task title + delete button; calls `onDelete(id)` |
| `src/components/TaskItem.test.tsx` | Unit tests for TaskItem |
| `src/components/TaskList.tsx` | Renders TaskItem for each task, or empty-state message |
| `src/components/TaskList.test.tsx` | Unit tests for TaskList |

---

### Task 1: Project Scaffold

**Task 1 completed.** Vite 6 + React 18 + TypeScript project scaffolded using `npm create vite@latest . -- --template react-ts --overwrite`. Boilerplate removed (`src/App.css`, `src/assets`, `src/App.tsx`). Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`) and Vitest + React Testing Library (`vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`) installed. `vite.config.ts` rewritten to include Tailwind plugin and Vitest config with jsdom environment. `tsconfig.app.json` updated with `"types": ["vitest/globals"]`. Created `src/test-setup.ts` (imports `@testing-library/jest-dom`), rewrote `src/index.css` to `@import "tailwindcss"`, added `test` and `test:watch` npm scripts, and created a placeholder `src/App.tsx`. Dev server and TypeScript compiler both verified clean.

---

### Task 2: AddTask Component

**Task 2 completed.** Created `src/types.ts` exporting the shared `Task` type (`{ id: string; title: string }`). Implemented `src/components/AddTask.tsx` as `const AddTask: FC<Props>` accepting `Props = { onAdd: (title: string) => void }`, with a controlled input that trims whitespace before calling `onAdd` and guards against blank submissions by returning early. Input clears after each valid submission. Three unit tests in `src/components/AddTask.test.tsx` cover the trimming behaviour, post-submit clearing, and blank-guard, all verified passing via TDD.

---

### Task 3: TaskItem Component

**Task 3 completed.** Created `src/components/TaskItem.tsx` as `const TaskItem: FC<Props>` with `Props = { onDelete: (id: string) => void; task: Task }`, rendering a list item with the task title and an "Abandon 🐾" button whose `aria-label` is `"Abandon task"`; clicking it calls `onDelete(task.id)`. Two unit tests in `src/components/TaskItem.test.tsx` cover title display and the delete callback, verified passing via TDD (5 tests total across Tasks 2–3).

---

### Task 4: TaskList Component

**Task 4 completed.** Created `src/components/TaskList.tsx` as `const TaskList: FC<Props>` with `Props = { onDelete: (id: string) => void; tasks: Task[] }`, rendering a `<ul>` of `TaskItem` components when tasks exist, or a `<p>` empty-state message "😿 No purrjects yet. Add one below and get those paws moving!" when the array is empty. Three unit tests in `src/components/TaskList.test.tsx` cover the empty-state display, rendering a list item per task, and hiding the empty-state when tasks are present — bringing the total to 8 passing tests across Tasks 2–4.

---

### Task 5: App Integration and Cat Theming

**Files:**
- Create: `src/App.tsx` (replace placeholder)
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write failing integration tests in `src/App.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

test('displays the app heading', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /purrductivity/i })).toBeInTheDocument()
})

test('adds a task when the form is submitted', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByRole('textbox'), 'Feed the cat')
  await user.click(screen.getByRole('button', { name: /add purrject/i }))

  expect(screen.getByText('Feed the cat')).toBeInTheDocument()
})

test('removes a task when the abandon button is clicked', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByRole('textbox'), 'Feed the cat')
  await user.click(screen.getByRole('button', { name: /add purrject/i }))
  await user.click(screen.getByRole('button', { name: /abandon/i }))

  expect(screen.queryByText('Feed the cat')).not.toBeInTheDocument()
})

test('shows empty state after all tasks are deleted', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByRole('textbox'), 'Feed the cat')
  await user.click(screen.getByRole('button', { name: /add purrject/i }))
  await user.click(screen.getByRole('button', { name: /abandon/i }))

  expect(screen.getByText(/no purrjects yet/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```

Expected: 4 failures — the placeholder App renders `<div>Purrductivity</div>`, not the full UI, so the heading role query fails.

- [ ] **Step 3: Implement `src/App.tsx`**

```tsx
import type { FC } from 'react'
import { useState } from 'react'
import AddTask from './components/AddTask'
import TaskList from './components/TaskList'
import type { Task } from './types'

const App: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = (title: string) => {
    setTasks(prev => [...prev, { id: crypto.randomUUID(), title }])
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="mx-auto max-w-xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-orange-600">🐱 Purrductivity</h1>
          <p className="mt-2 text-gray-500">Your purr-sonal task manager</p>
        </header>
        <main className="flex flex-col gap-6">
          <TaskList onDelete={deleteTask} tasks={tasks} />
          <AddTask onAdd={addTask} />
        </main>
      </div>
    </div>
  )
}

export default App
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test
```

Expected: 12 tests pass.

- [ ] **Step 5: Start the dev server in the background**

```bash
npm run dev > /tmp/vite.log 2>&1 &
timeout 30 bash -c 'until grep -q "Local:" /tmp/vite.log; do sleep 1; done' || { cat /tmp/vite.log; exit 1; }
echo "Dev server ready"
```

- [ ] **Step 6: Validate initial state in browser**

Use `mcp__playwright__browser_navigate` to navigate to `http://localhost:5173`.

Use `mcp__playwright__browser_snapshot` to capture the page and its element refs. Confirm all of the following are present — if any are missing, fix the implementation before continuing:
- A heading containing "Purrductivity"
- The subtitle "Your purr-sonal task manager"
- The empty-state text "No purrjects yet"
- A text input (note its `ref` for Step 7) and an "Add Purrject" button

- [ ] **Step 7: Validate the add task flow**

Use `mcp__playwright__browser_type` to type "Chase the laser dot" into the text input. Use the `ref` of the text input from the Step 6 snapshot to identify the element precisely.

Use `mcp__playwright__browser_click` to click the "Add Purrject" button (use its `ref` from the snapshot).

Use `mcp__playwright__browser_snapshot` to confirm "Chase the laser dot" appears in the task list and the input field is now empty. If not, fix the implementation before continuing.

- [ ] **Step 8: Validate the delete task flow**

Use `mcp__playwright__browser_click` to click the "Abandon 🐾" button (use its `ref` from the Step 7 snapshot).

Use `mcp__playwright__browser_snapshot` to confirm "Chase the laser dot" is gone and the empty-state message "No purrjects yet" has returned. If not, fix the implementation before continuing.

- [ ] **Step 9: Stop the dev server**

```bash
kill $(lsof -ti:5173) 2>/dev/null || pkill -f "vite" 2>/dev/null || true
```

- [ ] **Step 10: Commit**

Use the `creative-commits` skill to commit `src/App.tsx` and `src/App.test.tsx`.

- [ ] **Step 11: Compress this task in the plan**

Replace this task's full section with a one-paragraph summary of what was done, then commit the plan update using the `creative-commits` skill.

---

## Self-Review Checklist

- [ ] All spec requirements have a corresponding task
- [ ] No TBD/TODO/placeholder steps in any un-compressed task
- [ ] Type names are consistent across all tasks (`Task`, `addTask`, `deleteTask`, `onAdd`, `onDelete`)
- [ ] The plan header includes a `**Worktree:**` field
- [ ] Every task ends with a compression step
