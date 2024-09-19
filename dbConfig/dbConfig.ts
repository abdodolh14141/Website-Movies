import mongoose from "mongoose";

export async function Connect() {
  try {
    const mongoUrl = process.env.URL_MONGO as string;

    if (!mongoUrl) {
      console.error("MongoDB URL is not defined in the environment variables.");
      throw new Error("MongoDB connection string is missing.");
    }

    // Connect to the MongoDB database
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true, // Use the new URL string parser
      useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
    });

    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error; // Throw error to handle it in the calling function
  }
}

// Handle connection events outside of the Connect function
mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established.");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connection lost. Attempting to reconnect...");
});
