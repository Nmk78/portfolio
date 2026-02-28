import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { skillSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { isValidObjectId } from "@/lib/validation";
import { successEnvelope, errorEnvelope } from "@/lib/envelope";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(
      successEnvelope("Skills retrieved successfully", skills)
    );
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      errorEnvelope("Failed to fetch skills"),
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
    const validatedData = skillSchema.parse(body);

    const newSkill = await prisma.skill.create({
      data: validatedData,
    });

    return NextResponse.json(
      successEnvelope("Skill created successfully", newSkill),
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        errorEnvelope("Validation error occurred", JSON.stringify(error.errors)),
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          errorEnvelope("Skill already exists"),
          { status: 400 }
        );
      }
    }

    console.error("Error creating skill:", error);
    return NextResponse.json(
      errorEnvelope("Failed to create skill"),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(errorEnvelope("Unauthorized"), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        errorEnvelope("Skill ID is required"),
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        errorEnvelope("Invalid skill ID format"),
        { status: 400 }
      );
    }

    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json(
      successEnvelope("Skill deleted successfully", null)
    );
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      errorEnvelope("Failed to delete skill"),
      { status: 500 }
    );
  }
}
