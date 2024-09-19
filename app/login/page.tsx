"use client";

import React, { useEffect, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // For Google Login loading
  const router = useRouter();

  const onLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { email, password } = user;
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        toast.error("Login failed. Please check your credentials.");
      } else {
        toast.success("Successfully logged in!");
        router.push("/movies");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          router.replace("/movies");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession(); // Checking session on component mount
  }, [router]);

  const onSuccess = async (response: any) => {
    setGoogleLoading(true); // Set loading state for Google Login
    try {
      // Get the Google token from the response
      const { credential } = response;

      // Sign in using NextAuth's Google provider
      const result = await signIn("google", {
        callbackUrl: "/movies",
        redirect: false, // We want to handle redirection manually
      });

      // Call your backend API to register the user in the database
      const resDatabase = await axios.post(
        "/api/user/googleSignIn",
        credential
      );

      if (resDatabase.status === 200 && result?.ok) {
        toast.success(resDatabase.data.message);
      } else {
        toast.error(resDatabase.data.message);
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      toast.error("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Toaster />
      <div className="w-full max-w-5xl p-8 rounded-lg text-black shadow-md transform transition-all duration-500 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-500 to-purple-600">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
        </header>
        <form onSubmit={onLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              onChange={handleChange}
              name="email"
              id="email"
              placeholder="Enter Your Email"
              value={user.email}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              aria-label="Email Input"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              onChange={handleChange}
              name="password"
              id="password"
              placeholder="Enter Your Password"
              value={user.password}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              aria-label="Password Input"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-4 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
            aria-label="Submit Login"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          {googleLoading ? (
            <div className="text-sm text-gray-600">
              Logging in with Google...
            </div>
          ) : (
            <div className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300">
              <button onClick={onSuccess} className="p-3 cursor-pointer">
                <img
                  src="https://img.icons8.com/?size=100&id=EgRndDDLh8kS&format=png&color=000000"
                  alt="image gmail"
                  width={50}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
