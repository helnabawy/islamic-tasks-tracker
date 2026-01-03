import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    let reminders
    if (userId && userId !== 'guest') {
      reminders = await db.quranReminder.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      // For guest mode or no userId, return empty or sample data
      reminders = []
    }

    return NextResponse.json(reminders)
  } catch (error) {
    console.error('Error fetching Quran reminders:', error)
    return NextResponse.json({ error: 'Failed to fetch Quran reminders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { surahNumber, surahName, startAyah, endAyah, notes, reminderTime, userId } = body

    if (!surahNumber || !startAyah || !endAyah) {
      return NextResponse.json({ error: 'Surah number and ayahs are required' }, { status: 400 })
    }

    // For guest mode, we don't save to database
    if (!userId || userId === 'guest') {
      return NextResponse.json({
        id: Date.now().toString(),
        surahNumber,
        surahName,
        startAyah,
        endAyah,
        notes: notes || null,
        completed: false,
        reminderTime: reminderTime ? new Date(reminderTime) : null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    const reminder = await db.quranReminder.create({
      data: {
        surahNumber,
        surahName,
        startAyah,
        endAyah,
        notes,
        reminderTime: reminderTime ? new Date(reminderTime) : null,
        userId
      }
    })

    return NextResponse.json(reminder)
  } catch (error) {
    console.error('Error creating Quran reminder:', error)
    return NextResponse.json({ error: 'Failed to create Quran reminder' }, { status: 500 })
  }
}
