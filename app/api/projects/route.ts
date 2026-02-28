import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { projectSchema } from "@/lib/validations";
import { getAuth } from "@clerk/nextjs/server";
import { isValidObjectId, generateUniqueSlug } from "@/lib/validation";
import { successEnvelope, errorEnvelope } from "@/lib/envelope";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (id && !isValidObjectId(id)) {
      return NextResponse.json(
        errorEnvelope("Invalid project ID format"),
        { status: 400 }
      );
    }

    let projects;
    if (slug) {
      projects = await prisma.project.findUnique({ where: { slug } });
    } else if (id) {
      projects = await prisma.project.findUnique({ where: { id } });
    } else {
      projects = await prisma.project.findMany();
    }

    return NextResponse.json(
      successEnvelope("Projects retrieved successfully", projects)
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      errorEnvelope("Failed to fetch projects"),
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
    const validatedData = projectSchema.parse(body);

    const existingSlugs = await prisma.project.findMany({
      select: { slug: true },
    });
    const slug = generateUniqueSlug(
      validatedData.title,
      existingSlugs.map((p) => p.slug)
    );

    const newProject = await prisma.project.create({
      data: {
        slug,
        title: validatedData.title,
        shortDesc: validatedData.shortDesc,
        description: validatedData.description,
        githubLink: validatedData.githubLink || null,
        liveLink: validatedData.liveLink || null,
        images: validatedData.images,
        techStack: validatedData.techStack,
        keyFeatures: validatedData.keyFeatures,
      },
    });

    return NextResponse.json(
      successEnvelope("Project created successfully", newProject),
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        errorEnvelope("Validation error occurred", JSON.stringify(error.errors)),
        { status: 400 }
      );
    }

    console.error("Error creating project:", error);
    return NextResponse.json(
      errorEnvelope("Failed to create project"),
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        errorEnvelope("Project ID is required"),
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        errorEnvelope("Invalid project ID format"),
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    const currentProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!currentProject) {
      return NextResponse.json(
        errorEnvelope("Project not found"),
        { status: 404 }
      );
    }

    let slug = currentProject.slug;
    if (validatedData.title !== currentProject.title) {
      const existingSlugs = await prisma.project.findMany({
        select: { slug: true },
        where: { NOT: { id } },
      });
      slug = generateUniqueSlug(
        validatedData.title,
        existingSlugs.map((p) => p.slug)
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        slug,
        title: validatedData.title,
        shortDesc: validatedData.shortDesc,
        description: validatedData.description,
        githubLink: validatedData.githubLink || null,
        liveLink: validatedData.liveLink || null,
        images: validatedData.images,
        techStack: validatedData.techStack,
        keyFeatures: validatedData.keyFeatures,
      },
    });

    return NextResponse.json(
      successEnvelope("Project updated successfully", updatedProject)
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        errorEnvelope("Validation error occurred", JSON.stringify(error.errors)),
        { status: 400 }
      );
    }

    console.error("Error updating project:", error);
    return NextResponse.json(
      errorEnvelope("Failed to update project"),
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
        errorEnvelope("Project ID is required"),
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        errorEnvelope("Invalid project ID format"),
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(
      successEnvelope("Project deleted successfully", null)
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      errorEnvelope("Failed to delete project"),
      { status: 500 }
    );
  }
}
