import { NextResponse, NextRequest } from "next/server";
import User from "@/app/models/userModel";
import { Connect } from "@/dbConfig/dbConfig";
import bcrypt from "bcrypt"; // Correctly import bcrypt
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    // Ensure the database connection is established
    await Connect();

    const resBody = await req.json();
    const { name, email, age, password } = resBody;

    // Check if all required fields are provided
    if (!name || !email || !age || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase(); // Normalize email to lowercase

    // Check if user already exists
    const existingUser = await User.findOne({ Email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "This email is already in use.",
        },
        { status: 409 }
      );
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      Email: normalizedEmail,
      UserName: name,
      Age: age,
      Password: hashedPassword,
      isAdmin: false,
    });

    // Save the new user to the database
    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Sign up successful.",
        user: {
          email: newUser.Email,
          name: newUser.UserName,
        }, // Exclude sensitive information from response
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user sign-up:", error);

    // Determine the error type and set a relevant message
    const errorMessage =
      error instanceof mongoose.Error
        ? "Database error occurred. Please try again later."
        : "An error occurred while processing your request.";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
