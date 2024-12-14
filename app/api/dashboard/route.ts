import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const userId = session.user.id

  const totalTasks = await prisma.task.count({ where: { userId } })
  const completedTasks = await prisma.task.count({ where: { userId, status: 'finished' } })
  const pendingTasks = totalTasks - completedTasks

  const now = new Date()

  const pendingTasksData = await prisma.task.findMany({
    where: { userId, status: 'pending' },
    select: {
      startTime: true,
      endTime: true,
      priority: true,
    },
  })

  const completedTasksData = await prisma.task.findMany({
    where: { userId, status: 'finished' },
    select: {
      startTime: true,
      endTime: true,
    },
  })

  const priorityStats = pendingTasksData.reduce((acc, task) => {
    const timeLapsed = Math.max(0, now.getTime() - task.startTime.getTime()) / 3600000 // in hours
    const estimatedTimeLeft = Math.max(0, task.endTime.getTime() - now.getTime()) / 3600000 // in hours

    if (!acc[task.priority]) {
      acc[task.priority] = { timeLapsed: 0, estimatedTimeLeft: 0 }
    }

    acc[task.priority].timeLapsed += timeLapsed
    acc[task.priority].estimatedTimeLeft += estimatedTimeLeft

    return acc
  }, {} as Record<number, { timeLapsed: number; estimatedTimeLeft: number }>)

  const totalCompletionTime = completedTasksData.reduce((sum, task) => {
    return sum + (task.endTime.getTime() - task.startTime.getTime()) / 3600000 // in hours
  }, 0)

  const averageCompletionTime = completedTasks > 0 ? totalCompletionTime / completedTasks : 0

  return NextResponse.json({
    totalTasks,
    completedTasksPercent: (completedTasks / totalTasks) * 100 || 0,
    pendingTasksPercent: (pendingTasks / totalTasks) * 100 || 0,
    priorityStats,
    averageCompletionTime,
  })
}

