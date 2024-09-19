import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: [true, "User name is required"],
    unique: true,
    minlength: [3, "User name must be at least 3 characters long"],
  },
  Email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true, // Remove any trailing whitespace
    lowercase: true, // Store email in lowercase
    match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"], // Validate email format
  },
  Image: {
    type: String,
  },
  Age: {
    type: Number,
    min: [0, "Age cannot be negative"],
    default: 20,
  },
  Password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
