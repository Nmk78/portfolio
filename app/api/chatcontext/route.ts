import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const context = await prisma.chatContext.findFirst()
    return NextResponse.json(context || { content: '' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch context' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json()
    const context = await prisma.chatContext.create({ data: { content } })
    return NextResponse.json(context, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create context' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, content } = await request.json();

    // Step 1: Create a new record with an auto-generated ID
    const newContext = await prisma.chatContext.create({
      data: {
        content,   // The updated content, ID will be auto-generated
      },
    });

    // Step 2: Delete the old record with the old ID
    await prisma.chatContext.delete({
      where: { id }, // Delete the old record using the old ID
    });

    return NextResponse.json(newContext, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update context' }, { status: 500 });
  }
}
