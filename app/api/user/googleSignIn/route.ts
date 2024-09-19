// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Connect } from "@/dbConfig/dbConfig"; // Import your DB connection
import User from "../../../models/userModel"; // Import the user model

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  await Connect(); // Ensure the database is connected

  if (req.method === "POST") {
    const { email, name, image } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ Email: email });

      if (!user) {
        // If user doesn't exist, create a new user
        const Newuser = new User({
          Email: email,
          UserName: name,
          Image: image,
        });

        await Newuser.save();

        console.log(Newuser);

        return res.status(200).json({
          success: true,
          message: "Success Create New User By 0Auth",
        });
      } else {
        return res.status(200).json({ success: true, user });
      }
    } catch (error) {
      console.error("Error saving user:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error saving user" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
