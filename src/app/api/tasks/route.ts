import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    let tasks
    if (userId && userId !== 'guest') {
      tasks = await db.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      // For guest mode or no userId, return empty or sample data
      tasks = []
    }

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, priority, dueDate, userId } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // For guest mode, we don't save to database
    if (!userId || userId === 'guest') {
      return NextResponse.json({
        id: Date.now().toString(),
        title,
        description: description || null,
        completed: false,
        category: category || 'general',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    const task = await db.task.create({
      data: {
        title,
        description,
        category: category || 'general',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
