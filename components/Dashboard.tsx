'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [filter, setFilter] = useState({ priority: '', status: '' })
  const [sort, setSort] = useState({ by: '', order: 'asc' })
  const router = useRouter()

  useEffect(() => {
    fetchDashboardStats()
    fetchTasks()
  }, [])

  const fetchDashboardStats = async () => {
    const res = await fetch('/api/dashboard')
    const data = await res.json()
    setStats(data)
  }

  const fetchTasks = async () => {
    let url = '/api/tasks'
    const params = new URLSearchParams()
    if (filter.priority) params.append('priority', filter.priority)
    if (filter.status) params.append('status', filter.status)
    if (sort.by) {
      params.append('sortBy', sort.by)
      params.append('order', sort.order)
    }
    if (params.toString()) url += `?${params.toString()}`

    const res = await fetch(url)
    const data = await res.json()
    setTasks(data)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }

  const handleSortChange = (by: string) => {
    setSort(prev => ({
      by,
      order: prev.by === by && prev.order === 'asc' ? 'desc' : 'asc'
    }))
  }

  useEffect(() => {
    fetchTasks()
  }, [filter, sort])

  if (!stats) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Tasks</h2>
          <p className="text-3xl">{stats.totalTasks}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Completed Tasks</h2>
          <p className="text-3xl">{stats.completedTasksPercent.toFixed(2)}%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Pending Tasks</h2>
          <p className="text-3xl">{stats.pendingTasksPercent.toFixed(2)}%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Avg. Completion Time</h2>
          <p className="text-3xl">{stats.averageCompletionTime.toFixed(2)} hours</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Priority Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(stats.priorityStats).map(([priority, data]: [string, any]) => (
            <div key={priority} className="bg-gray-100 p-2 rounded">
              <h3 className="font-semibold">Priority {priority}</h3>
              <p>Time Lapsed: {data.timeLapsed.toFixed(2)} hours</p>
              <p>Estimated Time Left: {data.estimatedTimeLeft.toFixed(2)} hours</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div>
          <select name="priority" onChange={handleFilterChange} className="mr-2 p-2 border rounded">
            <option value="">All Priorities</option>
            {[1, 2, 3, 4, 5].map(p => (
              <option key={p} value={p}>Priority {p}</option>
            ))}
          </select>
          <select name="status" onChange={handleFilterChange} className="p-2 border rounded">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="finished">Finished</option>
          </select>
        </div>
        <button onClick={() => router.push('/tasks/new')} className="bg-blue-500 text-white px-4 py-2 rounded">
          New Task
        </button>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left cursor-pointer" onClick={() => handleSortChange('startTime')}>
              Start Time {sort.by === 'startTime' && (sort.order === 'asc' ? '↑' : '↓')}
            </th>
            <th className="p-2 text-left cursor-pointer" onClick={() => handleSortChange('endTime')}>
              End Time {sort.by === 'endTime' && (sort.order === 'asc' ? '↑' : '↓')}
            </th>
            <th className="p-2 text-left">Priority</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} className="border-t">
              <td className="p-2">{task.title}</td>
              <td className="p-2">{new Date(task.startTime).toLocaleString()}</td>
              <td className="p-2">{new Date(task.endTime).toLocaleString()}</td>
              <td className="p-2">{task.priority}</td>
              <td className="p-2">{task.status}</td>
              <td className="p-2">
                <button onClick={() => router.push(`/tasks/${task.id}`)} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => {/* implement delete */ }} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

