import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cvSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import { getAuth } from '@clerk/nextjs/server';
import { successEnvelope, errorEnvelope } from '@/lib/envelope';

export async function GET() {
  try {
    const cv = await prisma.cv.findFirst();

    return NextResponse.json(
      successEnvelope("CV information retrieved successfully", cv)
    );
  } catch (error) {
    console.error("Error fetching CV:", error);
    return NextResponse.json(
      errorEnvelope("Failed to fetch CV information"),
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
    const validatedData = cvSchema.parse(body);

    const existingCvEntry = await prisma.cv.findFirst();

    if (existingCvEntry) {
      const updatedCv = await prisma.cv.update({
        where: { id: existingCvEntry.id },
        data: validatedData,
      });

      return NextResponse.json(
        successEnvelope("CV information updated successfully", updatedCv)
      );
    } else {
      const newCv = await prisma.cv.create({
        data: validatedData,
      });

      return NextResponse.json(
        successEnvelope("CV information created successfully", newCv),
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

    console.error("Error creating/updating CV:", error);
    return NextResponse.json(
      errorEnvelope("Failed to create or update CV information"),
      { status: 500 }
    );
  }
}
