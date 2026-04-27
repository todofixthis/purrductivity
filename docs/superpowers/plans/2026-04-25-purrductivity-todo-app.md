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

**Task 5 completed.** Replaced the placeholder `src/App.tsx` with a full implementation — a `const App: FC` that owns `tasks` state via `useState<Task[]>`, adds tasks using `crypto.randomUUID` for unique IDs, and deletes by filtering on ID. The UI wraps AddTask and TaskList in a cat-themed layout on an amber background with heading "🐱 Purrductivity" and subheading "Your purr-sonal task manager". Four integration tests in `src/App.test.tsx` cover heading display, add flow, delete flow, and empty-state restoration — bringing the suite to 12 passing tests. Playwright headless browser validation confirmed the initial state, add flow, and delete flow all behave correctly in a real browser.

---

## Self-Review Checklist

- [ ] All spec requirements have a corresponding task
- [ ] No TBD/TODO/placeholder steps in any un-compressed task
- [ ] Type names are consistent across all tasks (`Task`, `addTask`, `deleteTask`, `onAdd`, `onDelete`)
- [ ] The plan header includes a `**Worktree:**` field
- [ ] Every task ends with a compression step
