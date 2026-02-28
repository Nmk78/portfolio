import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { personalInfoSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import { getAuth } from '@clerk/nextjs/server';
import { successEnvelope, errorEnvelope } from '@/lib/envelope';

export async function GET() {
  try {
    const personalInfo = await prisma.personalInfo.findFirst();
    
    return NextResponse.json(
      successEnvelope("Personal info retrieved successfully", personalInfo)
    );
  } catch (error) {
    console.error("Error fetching personal info:", error);
    return NextResponse.json(
      errorEnvelope("Failed to fetch personal info"),
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
    const validatedData = personalInfoSchema.parse(body);

    const personalInfoEntry = await prisma.personalInfo.findFirst();

    if (personalInfoEntry) {
      const updatedInfo = await prisma.personalInfo.update({
        where: { id: personalInfoEntry.id },
        data: validatedData,
      });

      return NextResponse.json(
        successEnvelope("Personal info updated successfully", updatedInfo)
      );
    } else {
      const newInfo = await prisma.personalInfo.create({
        data: validatedData,
      });

      return NextResponse.json(
        successEnvelope("Personal info created successfully", newInfo),
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

    console.error("Error updating personal info:", error);
    return NextResponse.json(
      errorEnvelope("Failed to update personal info"),
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
    
    const existingInfo = await prisma.personalInfo.findFirst();
    if (existingInfo) {
      return NextResponse.json(
        errorEnvelope("Personal info already exists. Use PUT to update."),
        { status: 409 }
      );
    }
    
    const body = await request.json();
    const validatedData = personalInfoSchema.parse(body);

    const newPersonalInfo = await prisma.personalInfo.create({
      data: validatedData,
    });

    return NextResponse.json(
      successEnvelope("Personal info created successfully", newPersonalInfo),
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        errorEnvelope("Validation error occurred", JSON.stringify(error.errors)),
        { status: 400 }
      );
    }

    console.error("Error creating personal info:", error);
    return NextResponse.json(
      errorEnvelope("Failed to create personal info"),
      { status: 500 }
    );
  }
}
