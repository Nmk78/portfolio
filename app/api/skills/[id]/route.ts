import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { skillSchema } from "@/lib/validations";

// PUT - Update Skill by ID
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          status: "error",
          message: "Skill ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = skillSchema.parse(body); // Zod validation

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: validatedData,
    });

    const responseEnvelope = {
      status: "success",
      message: "Skill updated successfully",
      data: updatedSkill,
    };

    return NextResponse.json(responseEnvelope);
  } catch (error: unknown) {
    console.error("PUT error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Validation failed",
          error: error.errors,
          data: null,
        },
        { status: 400 }
      );
    }

    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as { code: string }).code === "P2002") {
        return NextResponse.json(
          {
            status: "error",
            message: "Skill name already exists",
            data: null,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update skill",
        data: null,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete Skill by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          status: "error",
          message: "Skill ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    await prisma.skill.delete({
      where: { id },
    });

    const responseEnvelope = {
      status: "success",
      message: "Skill deleted successfully",
      data: null,
    };

    return NextResponse.json(responseEnvelope);
  } catch (error: unknown) {
    console.error("DELETE error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete skill",
        error: error, // Additional debug info
        data: null,
      },
      { status: 500 }
    );
  }
}
