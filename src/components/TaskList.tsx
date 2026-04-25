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
