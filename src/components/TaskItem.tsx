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
