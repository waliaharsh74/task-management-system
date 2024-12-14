'use client'

import TaskForm from '../../../components/TaskForm'

export default function NewTask() {
  const handleSubmit = async (taskData: any) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
    if (res.ok) {
      // Handle success (e.g., show a success message, redirect)
    } else {
      // Handle error
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Task</h1>
      <TaskForm onSubmit={handleSubmit} />
    </div>
  )
}

