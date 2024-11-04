import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { skillSchema } from "@/lib/validations";
import { checkDatabaseConnection } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

// GET Handler
export async function GET() {
  try {
    console.log("🚀 ~ GETTing Skills:")

    const skills = await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    console.log("🚀 ~ GET ~ skills:", skills)

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
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
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
      // Zod validation error handling
      const errorResponseEnvelope = {
        status: 'error',
        message: 'Validation error occurred',
        error: error.errors,
        data: null,
      };
      return NextResponse.json(errorResponseEnvelope, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      if (error.code === "P2002") {
        const errorResponseEnvelope = {
          status: 'error',
          message: 'Skill already exists',
          error: error.message,
          data: null,
        };
        return NextResponse.json(errorResponseEnvelope, { status: 400 });
      }
    }

    if (error instanceof Error) {
      // Handle general errors
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      const errorResponseEnvelope = {
        status: 'error',
        message: `Failed to create skill: ${error.message}`,
        error: error.message,
        data: null,
      };

      return NextResponse.json(errorResponseEnvelope, { status: 500 });
    }

    // Handle unknown errors
    const unknownErrorResponseEnvelope = {
      status: 'error',
      message: 'An unknown error occurred',
      error: String(error),
      data: null,
    };

    return NextResponse.json(unknownErrorResponseEnvelope, { status: 500 });
  }
}

// Frontend did not have functionality to update, just delete and add again if something wrong

// export async function PUT(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         {
//           status: "error",
//           message: "Skill ID is required",
//           data: null,
//         },
//         { status: 400 }
//       );
//     }

//     const body = await request.json();
//     const validatedData = skillSchema.parse(body); // Zod validation

//     const updatedSkill = await prisma.skill.update({
//       where: { id },
//       data: validatedData,
//     });

//     const responseEnvelope = {
//       status: "success",
//       message: "Skill updated successfully",
//       data: updatedSkill,
//     };

//     return NextResponse.json(responseEnvelope);
//   } catch (error: unknown) {
//     console.error("PUT error:", error);

//     if (error instanceof ZodError) {
//       return NextResponse.json(
//         {
//           status: "error",
//           message: "Validation failed",
//           error: error.errors,
//           data: null,
//         },
//         { status: 400 }
//       );
//     }

//     if (typeof error === "object" && error !== null && "code" in error) {
//       if ((error as { code: string }).code === "P2002") {
//         return NextResponse.json(
//           {
//             status: "error",
//             message: "Skill name already exists",
//             data: null,
//           },
//           { status: 400 }
//         );
//       }
//     }

//     return NextResponse.json(
//       {
//         status: "error",
//         message: "Failed to update skill",
//         data: null,
//       },
//       { status: 500 }
//     );
//   }
// }

// DELETE - Delete Skill by ID

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
