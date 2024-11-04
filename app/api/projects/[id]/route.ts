import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { projectSchema } from "@/lib/validations";



export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      const errorResponseEnvelope = {
        status: "error",
        message: "Project ID is required",
        data: null,
      };
      return NextResponse.json(errorResponseEnvelope, { status: 400 });
    }

    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    const updatedProject = await prisma.project.update({
      where: { id },
      data: validatedData,
    });

    const responseEnvelope = {
      status: "success",
      message: "Project updated successfully",
      data: updatedProject,
    };

    return NextResponse.json(responseEnvelope);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const errorResponseEnvelope = {
        status: "error",
        error: error.errors,
        message: "Validation error occurred",
        data: null,
      };
      return NextResponse.json(errorResponseEnvelope, { status: 400 });
    }

    const errorResponseEnvelope = {
      status: "error",
      error: error,
      message: "Failed to update project",
      data: null,
    };

    return NextResponse.json(errorResponseEnvelope, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      const errorResponseEnvelope = {
        status: "error",
        message: "Project ID is required",
        data: null,
      };
      return NextResponse.json(errorResponseEnvelope, { status: 400 });
    }

    await prisma.project.delete({
      where: { id },
    });

    const responseEnvelope = {
      status: "success",
      message: "Project deleted successfully",
      data: null,
    };

    return NextResponse.json(responseEnvelope);
  } catch (error) {
    const errorResponseEnvelope = {
      status: "error",
      error: error,
      message: "Failed to delete project",
      data: null,
    };

    return NextResponse.json(errorResponseEnvelope, { status: 500 });
  }
}
