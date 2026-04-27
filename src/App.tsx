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
