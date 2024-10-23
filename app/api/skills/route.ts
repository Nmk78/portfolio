import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { skillSchema } from "@/lib/validations";
import { checkDatabaseConnection } from "@/lib/db";
import { prisma } from "@/lib/prisma";

// GET Handler
export async function GET() {
  try {
    const skills = await prisma.skill.findMany();

    const responseEnvelope = {
      status: 'success',
      message: 'Skills retrieved successfully',
      data: skills,
    };

    return NextResponse.json(responseEnvelope);
  } catch (error) {
    const errorResponseEnvelope = {
      status: 'error',
      message: 'Failed to fetch skills',
      error: error, // Debugging info
      data: null,
    };

    return NextResponse.json(errorResponseEnvelope, { status: 500 });
  }
}

// POST Handler
export async function POST(request: Request) {
  try {
    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error("Failed to connect to the database");
    }

    console.log("✅ DB connection established");

    const body = await request.json();
    const validatedData = skillSchema.parse(body);
    console.log("🚀 ~ POST ~ validatedData:", validatedData);

    const newSkill = await prisma.skill.create({
      data: validatedData,
    });
    console.log("🚀 ~ POST ~ Created newSkill:", newSkill);

    const responseEnvelope = {
      status: 'success',
      message: 'Skill created successfully',
      data: newSkill,
    };

    return NextResponse.json(responseEnvelope, { status: 201 });
  } catch (error: unknown) {
    console.error("Detailed error:", error);

    if (error instanceof ZodError) {
      const errorResponseEnvelope = {
        status: 'error',
        message: 'Validation error occurred',
        error: error.errors,
        data: null,
      };
      return NextResponse.json(errorResponseEnvelope, { status: 400 });
    }

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      if ("code" in error && (error as any).code === "P2002") {
        const errorResponseEnvelope = {
          status: 'error',
          message: 'Skill already exists',
          error: error.message,
          data: null,
        };
        return NextResponse.json(errorResponseEnvelope, { status: 400 });
      }

      const errorResponseEnvelope = {
        status: 'error',
        message: `Failed to create skill: ${error.message}`,
        error: error,
        data: null,
      };

      return NextResponse.json(errorResponseEnvelope, { status: 500 });
    }

    const unknownErrorResponseEnvelope = {
      status: 'error',
      message: 'An unknown error occurred',
      error: error,
      data: null,
    };

    return NextResponse.json(unknownErrorResponseEnvelope, { status: 500 });
  }
}
