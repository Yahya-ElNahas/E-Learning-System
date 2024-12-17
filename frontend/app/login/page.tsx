"use client";

import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import '@/styles/globals.css'

export async function routeByRole(router: AppRouterInstance) {
    const role: string = await decodeRole();
    if (role === 'student') {
        router.push('/student');
      } else if (role === 'instructor') {
        router.push('/instructor');
      } else if (role === 'admin') {
        router.push('/admin');
      } else {
        throw new Error('Unknown role');
      }
}

export async function decodeRole(): Promise<string> {
    const decodedRole = await fetch('http://localhost:3000/auth/decodeRole', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        });
    if(!decodedRole.ok) throw new Error('Error');
    return (await decodedRole.json()).role;

}

export async function login(email: string, password: string, router: AppRouterInstance) {
    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
      });

    if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
    }
    routeByRole(router);
}

const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    setLoading(true);
    setErrorMessage('');

    try {
        await login(email, password, router);
    } catch (error: any) {
      if(error.message === "email_verification_required") router.push('/verify-email');
      setErrorMessage(error.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700 dark:text-gray-200">
          Login Page
        </h1>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            className="block text-gray-600 dark:text-gray-300 font-semibold mb-2"
          >
            Email / Username:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mb-4"
          />
          <label
            htmlFor="password"
            className="block text-gray-600 dark:text-gray-300 font-semibold mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300"
          >
            Login
          </button>
        </form>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
  
};

export default Login;
