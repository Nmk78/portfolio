import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { projectSchema } from "@/lib/validations";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const projects = id
      ? await prisma.project.findUnique({ where: { id } }) // Fetch by ID if provided
      : await prisma.project.findMany(); // Otherwise fetch all projects

    const responseEnvelope = {
      status: "success",
      message: "Projects retrieved successfully",
      data: projects,
    };

    return NextResponse.json(responseEnvelope);
  } catch (error) {
    const errorResponseEnvelope = {
      status: "error",
      error: error, // Debugging information
      message: "Failed to fetch projects",
      data: null,
    };
    return NextResponse.json(errorResponseEnvelope, { status: 500 });
  }
}
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const validatedData = projectSchema.parse(body);

//     const newProject = await prisma.project.create({
//       data: validatedData,
//     });

//     const responseEnvelope = {
//       status: 'success',
//       message: 'Project created successfully',
//       data: newProject,
//     };
//     return NextResponse.json(responseEnvelope, { status: 201 });
//   } catch (error: unknown) {
//     if (error instanceof ZodError) {
//       const errorResponseEnvelope = {
//         status: 'error',
//         error: error.errors,
//         message: 'Validation error occurred',
//         data: null,
//       };
//       return NextResponse.json(errorResponseEnvelope, { status: 400 });
//     }

//     const errorResponseEnvelope = {
//       status: 'error',
//       error: error,
//       message: 'Failed to create project',
//       data: null,
//     };
//     return NextResponse.json(errorResponseEnvelope, { status: 500 });
//   }
// }

// PUT Handler

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("🚀 ~ POST ~ body:", body);

    // Assuming you have a Zod schema for validation
    const validatedData = projectSchema.parse(body);

    const newProject = await prisma.project.create({
      data: {
        title: validatedData.title,
        shortDesc: validatedData.shortDesc,
        description: validatedData.description,
        githubLink: validatedData.githubLink ?? "",
        liveLink: validatedData.liveLink ?? "",
        images: validatedData.images,
        techStack: validatedData.techStack,
        keyFeatures: validatedData.keyFeatures,
      },
    });

    // const newProject = await prisma.project.create({data: validatedData});

    const responseEnvelope = {
      status: "success",
      message: "Project created successfully",
      data: newProject,
    };
    return NextResponse.json(responseEnvelope, { status: 201 });
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
      message: "Failed to create project",
      data: null,
    };
    return NextResponse.json(errorResponseEnvelope, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Project ID is required", data: null },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("🚀 ~ PUT ~ body:", body);
    const validatedData = projectSchema.parse(body);

    // Get the current project data from the database
    const currentProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!currentProject) {
      return NextResponse.json(
        { status: "error", message: "Project not found", data: null },
        { status: 404 }
      );
    }

    // Update the project in the database with the new image URLs and other data
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...validatedData,
        images: validatedData.images, // Replace the images array with the new one from the client
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          status: "error",
          error: error.errors,
          message: "Validation error occurred",
          data: null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        error: error,
        message: "Failed to update project",
        data: null,
      },
      { status: 500 }
    );
  }
}

// DELETE Handler
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Project ID is required", data: null },
        { status: 400 }
      );
    }

    // Fetch the project to get its images
    const project = await prisma.project.findUnique({
      where: { id },
      select: { images: true }, // Only fetch images
    });

    // Now delete the project from MongoDB
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({
      status: "success",
      message: "Project and associated images deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete project", error },
      { status: 500 }
    );
  }
}
