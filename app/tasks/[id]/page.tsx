'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import TaskForm from '../../../components/TaskForm'

export default function EditTask() {
  const [task, setTask] = useState<any>(null)
  const params = useParams()
  const id = params.id

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks/${id}`)
      if (res.ok) {
        const data = await res.json()
        setTask(data)
      } else {
        // Handle error
      }
    }
    fetchTask()
  }, [id])

  const handleSubmit = async (taskData: any) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
    if (res.ok) {
      // Handle success (e.g., show a success message, redirect)
    } else {
      // Handle error
    }
  }

  if (!task) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Task</h1>
      <TaskForm task={task} onSubmit={handleSubmit} />
    </div>
  )
}

