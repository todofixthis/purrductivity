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
