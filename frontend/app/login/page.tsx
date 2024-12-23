'use client'

import { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { motion } from 'framer-motion'
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      await login(email, password, router)
    } catch (error: any) {
      if (error.message === "email_verification_required") router.push('/verify-email')
      setErrorMessage(error.message || 'An error occurred during login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black via-blue-900 to-red-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-black bg-opacity-50 p-8 rounded-lg shadow-lg backdrop-blur-md"
      >
        <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-300 font-semibold mb-2"
            >
              Email / Username
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-300 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-2 rounded-md hover:from-blue-700 hover:to-red-700 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mt-4"
          >
            {errorMessage}
          </motion.p>
        )}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-400 hover:text-red-400 transition-colors duration-300">
              Register
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
