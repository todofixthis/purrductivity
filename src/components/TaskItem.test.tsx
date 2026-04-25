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
