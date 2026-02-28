import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { chatContextSchema } from '@/lib/validations'
import { ZodError } from 'zod'
import { getAuth } from '@clerk/nextjs/server'
import { successEnvelope, errorEnvelope } from '@/lib/envelope'

export async function GET() {
  try {
    const context = await prisma.chatContext.findFirst()
    return NextResponse.json(
      successEnvelope("Chat context retrieved successfully", context || { content: '' })
    );
  } catch (error) {
    console.error("Error fetching chat context:", error);
    return NextResponse.json(
      errorEnvelope("Failed to fetch chat context"),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(errorEnvelope("Unauthorized"), { status: 401 });
    }

    const body = await request.json();
    const validatedData = chatContextSchema.parse(body);

    const existingContext = await prisma.chatContext.findFirst();
    
    if (existingContext) {
      return NextResponse.json(
        errorEnvelope("Chat context already exists. Use PUT to update."),
        { status: 409 }
      );
    }

    const context = await prisma.chatContext.create({
      data: { content: validatedData.content },
    });

    return NextResponse.json(
      successEnvelope("Chat context created successfully", context),
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        errorEnvelope("Validation error occurred", JSON.stringify(error.errors)),
        { status: 400 }
      );
    }

    console.error("Error creating chat context:", error);
    return NextResponse.json(
      errorEnvelope("Failed to create chat context"),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(errorEnvelope("Unauthorized"), { status: 401 });
    }

    const body = await request.json();
    const validatedData = chatContextSchema.parse(body);

    const existingContext = await prisma.chatContext.findFirst();

    if (existingContext) {
      const updatedContext = await prisma.chatContext.update({
        where: { id: existingContext.id },
        data: { content: validatedData.content },
      });

      return NextResponse.json(
        successEnvelope("Chat context updated successfully", updatedContext)
      );
    } else {
      const newContext = await prisma.chatContext.create({
        data: { content: validatedData.content },
      });

      return NextResponse.json(
        successEnvelope("Chat context created successfully", newContext),
        { status: 201 }
      );
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        errorEnvelope("Validation error occurred", JSON.stringify(error.errors)),
        { status: 400 }
      );
    }

    console.error("Error updating chat context:", error);
    return NextResponse.json(
      errorEnvelope("Failed to update chat context"),
      { status: 500 }
    );
  }
}
