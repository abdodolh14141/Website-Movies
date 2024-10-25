import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/dbConfig";
import User from "@/app/models/userModel";
import bcrypt from "bcrypt";

// Define the expected shape of the request body
interface RequestBody {
  name: string;
  password: string;
  age: number;
}

// The method name should be GET, POST, PUT, etc. (adjust based on the action)
export async function POST(req: NextRequest) {
  await Connect();

  try {
    // Parse the JSON body from the request
    const { name, password, age }: RequestBody = await req.json();

    // Hash Password
    const hashPass = await bcrypt.hash(password, 10);

    // Update the user in the database
    const updateUser = await User.updateOne(
      { UserName: name },
      { $set: { Password: hashPass, Age: age } }
    );

    console.log(updateUser);

    // Return a success response with the updated user
    return NextResponse.json({
      success: true,
      message: "Success Create User Password And Age",
      user: updateUser,
      status: 200,
    });
  } catch (error: any) {
    console.error(error);

    // Return an error response
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}
