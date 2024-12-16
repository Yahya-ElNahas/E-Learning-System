"use client";
import { NextPage } from "next";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import '@/styles/globals.css';
import { routeByRole } from "../login/page";

const VerifyEmail: NextPage = () => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp
        }),
        credentials: 'include',
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      await routeByRole(router);
    } catch (error) {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-[#222831] p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700 dark:text-gray-200">
          Verify Email
        </h1>
        <form onSubmit={handleVerify}>
          <label
            htmlFor="otp"
            className="block text-gray-600 font-semibold mb-2 dark:text-gray-300"
          >
            Enter OTP:
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md mb-4 bg-gray-50 dark:bg-[#31363F] text-gray-700 dark:text-gray-200"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300"
          >
            Verify
          </button>
        </form>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
