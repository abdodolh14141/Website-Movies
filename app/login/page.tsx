"use client";

import React, { useEffect, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle login with credentials
  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: user.email,
        password: user.password,
      });

      if (res?.ok) {
        toast.success("Successfully logged in!");
        router.push("/movies");
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) router.replace("/movies");
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, [router]);

  // Handle Google sign-in
  const onGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      const result = await signIn("google", {
        callbackUrl: "/movies",
        redirect: false,
      });

      if (result?.ok) {
        toast.success("Successfully logged in with Google!");
      } else if (result?.error) {
        toast.error("Google Sign-In failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      toast.error("Google Sign-In failed. Please try again.");
    } finally {
      setGoogleLoading(false);
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
              name="email"
              id="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
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
              name="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
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
            <div className="text-sm text-white text-3xl">
              Logging in with Google...
            </div>
          ) : (
            <button
              onClick={onGoogleSignIn}
              className="p-3 cursor-pointer hover:scale-125"
              aria-label="Google Sign-In"
            >
              <img
                src="https://img.icons8.com/?size=100&id=EgRndDDLh8kS&format=png&color=000000"
                alt="Google Login Icon"
                width={50}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
