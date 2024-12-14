import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const { id } = await params

  const task = await prisma.task.findUnique({
    where: { id: id },
  })

  if (!task || task.userId !== session.user.id) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json(task)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { title, startTime, endTime, priority, status } = body

  if (priority && (priority < 1 || priority > 5)) {
    return NextResponse.json({ error: 'Priority must be between 1 and 5' }, { status: 400 })
  }

  if (status && status !== 'pending' && status !== 'finished') {
    return NextResponse.json({ error: 'Status must be either pending or finished' }, { status: 400 })
  }

  const task = await prisma.task.findUnique({
    where: { id: params.id },
  })

  if (!task || task.userId !== session.user.id) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  const updatedTask = await prisma.task.update({
    where: { id: params.id },
    data: {
      title,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      priority,
      status,
      ...(status === 'finished' && { endTime: new Date() }),
    },
  })

  return NextResponse.json(updatedTask)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const task = await prisma.task.findUnique({
    where: { id: params.id },
  })

  if (!task || task.userId !== session.user.id) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  await prisma.task.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}

