
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const AuthGate = ({ children }) => {
  const { currentUser } = useAuth();
  const [mode, setMode] = useState("login");

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#111827] text-white">
        <h1 className="text-3xl font-bold mb-8 text-white tracking-wide">
          🎵 Unreleased Music
        </h1>

        <div className="bg-[#1f2937] px-6 py-8 rounded-2xl shadow-md w-full max-w-sm">
          {mode === "login" ? <Login setMode={setMode} /> : <Signup setMode={setMode} />}

          <div className="mt-4 text-sm text-center text-gray-400">
            {mode === "login" ? (
              <>
                Need an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-pink-400 hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-pink-400 hover:underline"
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGate;
