import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Connect } from "@/dbConfig/dbConfig";
import User from "../../../models/userModel";
import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";

interface Credentials {
  email: string;
  password: string;
}

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: {
          label: "Password", // Fixed typo here from "eassword"
          type: "password",
        },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) {
          throw new Error("Credentials not provided");
        }

        const { email, password } = credentials;

        // Connect to the database
        await Connect();

        // Find user by email
        const user = await User.findOne({ Email: email });

        if (!user) {
          throw new Error("No user found with the provided email");
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        // Return user object (id, email, and name) to be used in session
        return {
          id: user._id.toString(),
          email: user.Email,
          name: user.UserName,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Handle sign in via Google provider
    async signIn({ profile }) {
      try {
        await Connect();

        // Check if the user already exists in the database
        const checkExists = await User.findOne({
          Email: profile?.email,
        });

        // If not, create a new user
        if (!checkExists) {
          await User.create({
            Email: profile?.email,
            UserName: profile?.name?.toLowerCase(),
            Image: profile?.image,
          });
        }

        return true;
      } catch (error) {
        console.log("Error during Google sign-in:", error);
        return false;
      }
    },

    // JWT callback to store user details in token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    // Session callback to store user details in session
    async session({ token, session }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
        };
      }
      return session;
    },
  },
  // Custom pages for sign-in, sign-out, etc.
  pages: {
    signIn: "/login",
  },
};

// Export NextAuth handler as GET and POST handlers
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
