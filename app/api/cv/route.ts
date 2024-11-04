import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming Prisma client is set up in the lib folder
import { cvSchema } from '@/lib/validations'; // Zod schema for validating the CV data
import { ZodError } from 'zod';
import { getAuth } from '@clerk/nextjs/server';

// GET: Fetch CV information
export async function GET() {
  try {
    const cv = await prisma.cv.findFirst(); // Fetch the CV entry

    const responseEnvelope = {
      status: 'success',
      message: 'CV information retrieved successfully',
      data: cv,
    };

    return NextResponse.json(responseEnvelope);
  } catch (error) {
    const errorResponseEnvelope = {
      status: 'error',
      error: (error as Error).message || 'Unknown error occurred', // Type assertion to Error
      message: 'Failed to fetch CV information',
      data: null,
    };
    return NextResponse.json(errorResponseEnvelope, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = cvSchema.parse(body); // Validate the incoming data

    // Check for an existing CV entry
    const existingCvEntry = await prisma.cv.findFirst();

    if (existingCvEntry) {
      // Update the existing entry instead of creating a duplicate
      const updatedCv = await prisma.cv.update({
        where: { id: existingCvEntry.id }, // Use the actual ObjectID here
        data: validatedData,
      });

      const responseEnvelope = {
        status: 'success',
        message: 'CV information updated successfully',
        data: updatedCv,
      };

      return NextResponse.json(responseEnvelope);
    } else {
      // Create a new entry if none exists
      const newCv = await prisma.cv.create({
        data: validatedData,
      });

      const responseEnvelope = {
        status: 'success',
        message: 'CV information created successfully',
        data: newCv,
      };

      return NextResponse.json(responseEnvelope, { status: 201 }); // 201 Created
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const errorResponseEnvelope = {
        status: 'error',
        error: error.errors, // Zod validation errors
        message: 'Validation error occurred',
        data: null,
      };
      return NextResponse.json(errorResponseEnvelope, { status: 400 });
    }

    const errorResponseEnvelope = {
      status: 'error',
      error: (error as Error).message || 'Unknown error occurred', // Type assertion to Error
      message: 'Failed to create or update CV information',
      data: null,
    };

    return NextResponse.json(errorResponseEnvelope, { status: 500 });
  }
}
