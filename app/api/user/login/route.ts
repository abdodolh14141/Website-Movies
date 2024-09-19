import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/dbConfig";
import User from "@/app/models/userModel";
import bcrypt from "bcrypt";

// Ensure the database connection is established only when necessary
export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await Connect();

    // Parse the request body
    const reqBody = await req.json();
    const { email, password } = reqBody;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 } // Use status 400 for bad request
      );
    }

    // Check if the user exists in the database
    const existingUser = await User.findOne({ Email: email });
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 } // Use status 401 for unauthorized
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.Password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // If login is successful, return a success response
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login",
      },
      { status: 500 } // Use status 500 for server errors
    );
  }
}
