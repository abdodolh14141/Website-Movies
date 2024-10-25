import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Connect } from "@/dbConfig/dbConfig";
import User from "../../../models/userModel";
import bcrypt from "bcrypt";

// Define the UserCredentials interface for the credentials provider
interface UserCredentials {
  email: string;
  password: string;
}

// Define the AuthOptions for NextAuth
const authOptions: NextAuthOptions = {
  jwt: {
    maxAge: 1 * 60 * 60, // JWT token expiry (1 hour)
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // Session expiry (1 hour)
  },
  providers: [
    // Google OAuth provider
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
    // Credentials provider (email/password login)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: UserCredentials | undefined) {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const { email, password } = credentials;

        try {
          // Connect to the database
          await Connect();

          // Find the user by email
          const user = await User.findOne({ Email: email });

          if (!user) {
            throw new Error("No user found with the provided email");
          }

          // Check if the password is valid
          const isPasswordValid = await bcrypt.compare(password, user.Password);
          if (!isPasswordValid) {
            throw new Error("Incorrect password");
          }

          // Return the user object if successful
          return {
            id: user._id.toString(),
            email: user.Email,
            name: user.UserName,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Failed to authorize user");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Ensure this secret is configured in .env

  callbacks: {
    // Sign-in callback for Google or other providers
    async signIn({ profile, account }) {
      if (account?.provider === "google" && profile) {
        await Connect();

        // Check if the user already exists in the database
        const existingUser = await User.findOne({ Email: profile.email });

        // Create a new user if they don't exist
        if (!existingUser) {
          await User.create({
            Email: profile.email?.toLowerCase(),
            UserName: profile.name?.toLowerCase(),
          });
        }

        return true; // Allow sign-in
      }

      return true; // Other providers can be handled here
    },

    // JWT callback: store additional user data in the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    // Session callback: pass token data into the session object
    async session({ session, token }) {
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

  // Custom sign-in page
  pages: {
    signIn: "/login", // Redirect to custom login page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
