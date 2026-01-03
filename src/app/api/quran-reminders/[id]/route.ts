import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { completed, notes, reminderTime } = body

    const reminder = await db.quranReminder.update({
      where: { id },
      data: {
        ...(completed !== undefined && { completed }),
        ...(notes !== undefined && { notes }),
        ...(reminderTime !== undefined && { reminderTime: reminderTime ? new Date(reminderTime) : null })
      }
    })

    return NextResponse.json(reminder)
  } catch (error) {
    console.error('Error updating Quran reminder:', error)
    return NextResponse.json({ error: 'Failed to update Quran reminder' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.quranReminder.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting Quran reminder:', error)
    return NextResponse.json({ error: 'Failed to delete Quran reminder' }, { status: 500 })
  }
}
