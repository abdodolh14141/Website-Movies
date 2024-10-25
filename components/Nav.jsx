"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Nav = () => {
  const [isLogin, setLogin] = useState(false);
  const [UserName, setNameUser] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  useEffect(() => {
    if (status === "authenticated") {
      setLogin(true);
      setNameUser(session?.user?.name || "");
    }
  }, [status, session]);

  return (
    <nav className="bg-red-950  text-white text-2xl p-4 flex items-center justify-between">
      <div className="flex items-center space-x-5">
        <Link href={"/"} className="hover:bg-red-700 p-1 rounded transition">
          Home
        </Link>

        <Link
          href="/movies"
          className="hover:bg-red-700 p-1 rounded transition"
        >
          Movies
        </Link>
      </div>

      {isLogin && (
        <div>
          <h1 className="text-center m-2 p-1 text-3xl">
            Welcome {UserName.split(" ")[0]}
          </h1>
        </div>
      )}

      <div className="flex items-center space-x-4">
        {isLogin ? (
          <>
            <Link
              href="/about"
              className="hover:text-gray-400 transition bg-red-950 hover:bg-emerald-600 p-1 rounded transition"
            >
              About
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white p-1 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/about"
              className="hover:bg-red-700 py-1 px-4 rounded transition"
            >
              About
            </Link>
            <Link
              href="/login"
              className="hover:bg-red-700 py-1 px-4 rounded transition"
            >
              Login
            </Link>
            <Link
              href="/signIn"
              className="hover:bg-red-700 py-1 px-4 rounded transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
