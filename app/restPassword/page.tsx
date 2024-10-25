"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { getSession } from "next-auth/react";

interface DataNewUser {
  name: string;
  password: string;
  age: number;
}

export default function CreateAccount() {
  const [formData, setFormData] = useState<DataNewUser>({
    name: "",
    password: "",
    age: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/user/createNewAccount", formData);
      if (res.status === 200) {
        toast.success("Account created successfully!");
        router.push("/movies");
      } else {
        toast.error("Error creating account. Please try again.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Check for an active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session && session.user) {
          setFormData((prevData) => ({
            ...prevData,
            name: session.user.name || "",
          }));
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Toaster />
      <div className="w-full max-w-4xl p-8 rounded-lg text-black shadow-md bg-gradient-to-r from-green-400 to-blue-500">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Complete Your Account
          </h1>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              onChange={handleChange}
              id="password"
              placeholder="Create a Password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="number"
              name="age"
              onChange={handleChange}
              id="age"
              placeholder="Enter Your Age"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-4 px-4 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
