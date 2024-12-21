/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import '@/styles/globals.css';
import ReturnHomeButtonComponent from "@/components/returnHomeButton";
import { login } from "../login/page";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("student"); 
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, email, password, role }),
      });
  
      const data = await response.json(); 
  
      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }
      
      try {
        await login(email, password, router);
      } catch (error: any) {
        if(error.message === "email_verification_required") router.push('/verify-email');
        else setError(error.message);
      }

    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <ReturnHomeButtonComponent/>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700 dark:text-gray-200">
          Register
        </h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-600 dark:text-gray-300 font-semibold mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-600 dark:text-gray-300 font-semibold mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-600 dark:text-gray-300 font-semibold mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-600 dark:text-gray-300 font-semibold mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-gray-600 dark:text-gray-300 font-semibold mb-2"
            >
              Role:
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300"
          >
            Register
          </button>
        </form>
        {error && (
          <p className="mt-4 text-red-500 dark:text-red-400 text-center">{error}</p>
        )}
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
    
};

export default Register;
