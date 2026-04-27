import type { FC, FormEvent } from 'react'
import { useState } from 'react'

type Props = {
  onAdd: (title: string) => void
}

const AddTask: FC<Props> = ({ onAdd }) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
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
        type="submit"
      >
        Add Purrject
      </button>
    </form>
  )
}

export default AddTask
