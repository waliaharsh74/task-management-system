import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const priority = searchParams.get('priority')
  const status = searchParams.get('status')
  const sortBy = searchParams.get('sortBy')
  const order = searchParams.get('order') as 'asc' | 'desc'

  let whereClause: any = { userId: session.user.id }
  if (priority) whereClause.priority = parseInt(priority)
  if (status) whereClause.status = status

  let orderByClause: any = {}
  if (sortBy === 'startTime' || sortBy === 'endTime') {
    orderByClause[sortBy] = order || 'asc'
  }

  const tasks = await prisma.task.findMany({
    where: whereClause,
    orderBy: orderByClause,
  })

  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { title, startTime, endTime, priority, status } = body

  if (!title || !startTime || !endTime || !priority || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (priority < 1 || priority > 5) {
    return NextResponse.json({ error: 'Priority must be between 1 and 5' }, { status: 400 })
  }

  if (status !== 'pending' && status !== 'finished') {
    return NextResponse.json({ error: 'Status must be either pending or finished' }, { status: 400 })
  }

  const task = await prisma.task.create({
    data: {
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      priority,
      status,
      userId: session.user.id,
    },
  })

  return NextResponse.json(task)
}

