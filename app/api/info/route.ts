import { NextResponse } from "next/server";
import mongoose from "mongoose";
import PersonalInfo from "@/models/PersonalInfo"; // Import your Mongoose model
import dbConnect from "@/lib/dbConnect"; // MongoDB connection setup (this can be a helper function)

export async function PUT(request: Request) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse the request body
    const updatedPersonalInfo = await request.json();
    const { userId, name, bio, description } = updatedPersonalInfo;

    // Ensure all necessary fields are present
    if (!userId || !name || !bio || !description) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 } // Bad Request
      );
    }

    // Check if personal info already exists for this user
    const existingPersonalInfo = await PersonalInfo.findOne({ userId });

    if (!existingPersonalInfo) {
      // If no existing info, create a new record
      const newPersonalInfo = await PersonalInfo.create(updatedPersonalInfo);
      return NextResponse.json(
        {
          message: "Personal info created successfully",
          personalInfo: newPersonalInfo,
        },
        { status: 201 } // 201 Created
      );
    } else {
      // If it exists, update the existing record
      existingPersonalInfo.name = name;
      existingPersonalInfo.bio = bio;
      existingPersonalInfo.description = description;

      const updatedInfo = await existingPersonalInfo.save();

      return NextResponse.json(
        {
          message: "Personal info updated successfully",
          personalInfo: updatedInfo,
        },
        { status: 200 } // 200 OK
      );
    }
  } catch (error) {
    console.error("Error processing personal info:", error);
    return NextResponse.json(
      {
        message: "Failed to process personal info",
        error: error.message,
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
