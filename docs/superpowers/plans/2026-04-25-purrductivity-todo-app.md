# Purrductivity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal cat-themed todo list app with add and delete task functionality.

**Architecture:** Single-page React app with component state managed in App; no backend or persistence. Three focused components (AddTask, TaskItem, TaskList) each with unit tests, wired together in App.

**Worktree:** `/Users/phx/Documents/purrductivity` [main]

**Tech Stack:** Vite 6, React 18, TypeScript, Tailwind CSS v4, Vitest, React Testing Library

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

**Files:**
- Create: `src/types.ts`
- Create: `src/components/AddTask.tsx`
- Create: `src/components/AddTask.test.tsx`

- [ ] **Step 1: Create `src/types.ts`**

```typescript
export type Task = {
  id: string
  title: string
}
```

- [ ] **Step 2: Write failing tests in `src/components/AddTask.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddTask from './AddTask'

test('calls onAdd with trimmed title when form is submitted', async () => {
  const onAdd = vi.fn()
  const user = userEvent.setup()
  render(<AddTask onAdd={onAdd} />)

  await user.type(screen.getByRole('textbox'), '  Feed the cat  ')
  await user.click(screen.getByRole('button', { name: /add purrject/i }))

  expect(onAdd).toHaveBeenCalledWith('Feed the cat')
})

test('clears the input after submission', async () => {
  const user = userEvent.setup()
  render(<AddTask onAdd={vi.fn()} />)

  const input = screen.getByRole('textbox')
  await user.type(input, 'Feed the cat')
  await user.click(screen.getByRole('button', { name: /add purrject/i }))

  expect(input).toHaveValue('')
})

test('does not call onAdd when input is blank', async () => {
  const onAdd = vi.fn()
  const user = userEvent.setup()
  render(<AddTask onAdd={onAdd} />)

  await user.click(screen.getByRole('button', { name: /add purrject/i }))

  expect(onAdd).not.toHaveBeenCalled()
})
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npm test
```

Expected: 3 failures — `Cannot find module './AddTask'`

- [ ] **Step 4: Implement `src/components/AddTask.tsx`**

```tsx
import type { FC } from 'react'
import { useState } from 'react'

type Props = {
  onAdd: (title: string) => void
}

const AddTask: FC<Props> = ({ onAdd }) => {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <div className="flex gap-2">
      <input
        aria-label="New task"
        className="flex-1 rounded-lg border border-orange-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        onChange={e => setValue(e.target.value)}
        placeholder="What needs to get done, fur real?"
        type="text"
        value={value}
      />
      <button
        className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
        onClick={handleSubmit}
        type="button"
      >
        Add Purrject
      </button>
    </div>
  )
}

export default AddTask
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test
```

Expected: 3 tests pass.

- [ ] **Step 6: Commit**

Use the `creative-commits` skill to commit `src/types.ts`, `src/components/AddTask.tsx`, and `src/components/AddTask.test.tsx`.

- [ ] **Step 7: Compress this task in the plan**

Replace this task's full section with a one-paragraph summary of what was done, then commit the plan update using the `creative-commits` skill.

---

### Task 3: TaskItem Component

**Files:**
- Create: `src/components/TaskItem.tsx`
- Create: `src/components/TaskItem.test.tsx`

- [ ] **Step 1: Write failing tests in `src/components/TaskItem.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Task } from '../types'
import TaskItem from './TaskItem'

const task: Task = { id: '1', title: 'Feed the cat' }

test('displays the task title', () => {
  render(<TaskItem onDelete={vi.fn()} task={task} />)
  expect(screen.getByText('Feed the cat')).toBeInTheDocument()
})

test('calls onDelete with the task id when the delete button is clicked', async () => {
  const onDelete = vi.fn()
  const user = userEvent.setup()
  render(<TaskItem onDelete={onDelete} task={task} />)

  await user.click(screen.getByRole('button', { name: /abandon/i }))

  expect(onDelete).toHaveBeenCalledWith('1')
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```

Expected: 2 failures — `Cannot find module './TaskItem'`

- [ ] **Step 3: Implement `src/components/TaskItem.tsx`**

```tsx
import type { FC } from 'react'
import type { Task } from '../types'

type Props = {
  onDelete: (id: string) => void
  task: Task
}

const TaskItem: FC<Props> = ({ onDelete, task }) => (
  <li className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
    <span className="text-gray-800">{task.title}</span>
    <button
      aria-label="Abandon task"
      className="ml-4 rounded-lg px-3 py-1 text-sm text-orange-500 hover:bg-orange-50"
      onClick={() => onDelete(task.id)}
      type="button"
    >
      Abandon 🐾
    </button>
  </li>
)

export default TaskItem
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test
```

Expected: 5 tests pass (3 from Task 2 + 2 new).

- [ ] **Step 5: Commit**

Use the `creative-commits` skill to commit `src/components/TaskItem.tsx` and `src/components/TaskItem.test.tsx`.

- [ ] **Step 6: Compress this task in the plan**

Replace this task's full section with a one-paragraph summary of what was done, then commit the plan update using the `creative-commits` skill.

---

### Task 4: TaskList Component

**Files:**
- Create: `src/components/TaskList.tsx`
- Create: `src/components/TaskList.test.tsx`

- [ ] **Step 1: Write failing tests in `src/components/TaskList.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import type { Task } from '../types'
import TaskList from './TaskList'

test('shows empty-state message when there are no tasks', () => {
  render(<TaskList onDelete={vi.fn()} tasks={[]} />)
  expect(screen.getByText(/no purrjects yet/i)).toBeInTheDocument()
})

test('renders a list item for each task', () => {
  const tasks: Task[] = [
    { id: '1', title: 'Feed the cat' },
    { id: '2', title: 'Pet the cat' },
  ]
  render(<TaskList onDelete={vi.fn()} tasks={tasks} />)

  expect(screen.getByText('Feed the cat')).toBeInTheDocument()
  expect(screen.getByText('Pet the cat')).toBeInTheDocument()
})

test('does not show the empty-state message when tasks exist', () => {
  const tasks: Task[] = [{ id: '1', title: 'Feed the cat' }]
  render(<TaskList onDelete={vi.fn()} tasks={tasks} />)

  expect(screen.queryByText(/no purrjects yet/i)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```

Expected: 3 failures — `Cannot find module './TaskList'`

- [ ] **Step 3: Implement `src/components/TaskList.tsx`**

```tsx
import type { FC } from 'react'
import type { Task } from '../types'
import TaskItem from './TaskItem'

type Props = {
  onDelete: (id: string) => void
  tasks: Task[]
}

const TaskList: FC<Props> = ({ onDelete, tasks }) => {
  if (tasks.length === 0) {
    return (
      <p className="py-8 text-center text-gray-400">
        😿 No purrjects yet. Add one below and get those paws moving!
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map(task => (
        <TaskItem key={task.id} onDelete={onDelete} task={task} />
      ))}
    </ul>
  )
}

export default TaskList
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test
```

Expected: 8 tests pass (5 from Tasks 2–3 + 3 new).

- [ ] **Step 5: Commit**

Use the `creative-commits` skill to commit `src/components/TaskList.tsx` and `src/components/TaskList.test.tsx`.

- [ ] **Step 6: Compress this task in the plan**

Replace this task's full section with a one-paragraph summary of what was done, then commit the plan update using the `creative-commits` skill.

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
