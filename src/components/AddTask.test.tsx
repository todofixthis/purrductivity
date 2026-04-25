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
