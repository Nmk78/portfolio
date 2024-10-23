import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { personalInfoSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function GET() {
  try {
    const personalInfo = await prisma.personalInfo.findFirst();
    
    const responseEnvelope = {
      status: 'success',
      message: 'Personal info retrieved successfully',
      data: personalInfo,
    };
    
    return NextResponse.json(responseEnvelope);
  } catch (error) {
    const errorResponseEnvelope = {
      status: 'error',
      error: error, // Debugging information
      message: 'Failed to fetch personal info',
      data: null,
    };
    return NextResponse.json(errorResponseEnvelope, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validatedData = personalInfoSchema.parse(body);

    // Fetch the existing personal info entry
    const personalInfoEntry = await prisma.personalInfo.findFirst();

    if (personalInfoEntry) {
      // Update the existing entry
      const updatedInfo = await prisma.personalInfo.update({
        where: { id: personalInfoEntry.id }, // Use the actual ObjectID here
        data: validatedData,
      });

      const responseEnvelope = {
        status: 'success',
        message: 'Personal info updated successfully',
        data: updatedInfo,
      };
      
      return NextResponse.json(responseEnvelope);
    } else {
      // Create a new entry if none exists
      const newInfo = await prisma.personalInfo.create({
        data: validatedData,
      });

      const responseEnvelope = {
        status: 'success',
        message: 'Personal info created successfully',
        data: newInfo,
      };
      
      return NextResponse.json(responseEnvelope, { status: 201 });
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
      error: error, // Debugging information
      message: 'Failed to update personal info',
      data: null,
    };

    return NextResponse.json(errorResponseEnvelope, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = personalInfoSchema.parse(body);

    // Create a new personal info entry
    const newPersonalInfo = await prisma.personalInfo.create({
      data: validatedData,
    });

    const responseEnvelope = {
      status: 'success',
      message: 'Personal info created successfully',
      data: newPersonalInfo,
    };

    return NextResponse.json(responseEnvelope, { status: 201 }); // 201 Created
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
      error: error, // Debugging information
      message: 'Failed to create personal info',
      data: null,
    };

    return NextResponse.json(errorResponseEnvelope, { status: 500 });
  }
}
