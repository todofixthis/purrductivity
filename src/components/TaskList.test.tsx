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
