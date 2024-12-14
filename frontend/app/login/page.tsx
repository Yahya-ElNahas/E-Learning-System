"use client";

import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import '@/styles/globals.css';

const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    try {
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

      const data = await response.json();
      console.log('Login successful:', data);

      try {
        const decodedRole = await fetch('http://localhost:3000/auth/decodeRole', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (decodedRole.ok) {
          const role: string = (await decodedRole.json()).role; 
          if(role === 'student') router.push('/student');
          else if(role === 'instructor') router.push('/instructor');
          else if(role === 'admin') router.push('/admin');
          else throw new Error('Error'); 
        } else {
          const errorData = await decodedRole.json();
          console.log('Error:', errorData);
        }

      }catch(e) {
          console.log(e);
        }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Login Page</h1>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="text"
            className="block text-gray-600 font-semibold mb-2"
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
            className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4"
          />
          <label
            htmlFor="password"
            className="block text-gray-600 font-semibold mb-2"
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
            className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
