'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import '@/styles/globals.css';

interface UserData {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  profilePictureUrl?: string;
}

const UpdateProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/profile/details', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
        setUsername(data.username);
        setEmail(data.email);
        setRole(data.role);
      } catch (err) {
        console.error('Error fetching user data:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const formData = new FormData();
    if (username !== userData?.username) formData.append('username', username);
    if (email !== userData?.email) formData.append('email', email);
    if (password) formData.append('password', password);
    if (profilePicture) formData.append('profilePicture', profilePicture);

    try {
      const response = await fetch('http://localhost:3000/users/profile/details', {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setSuccessMessage('Profile updated successfully');
      router.push(`/${role}`);

      if (updatedUser.email !== userData?.email) {
        setSuccessMessage('Profile updated successfully. Please verify your new email address.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userData) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:3000/users/profile', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      setSuccessMessage('User deleted successfully');
      router.push('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);/////
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-black bg-opacity-50 p-8 rounded-lg shadow-lg backdrop-blur-md"
        >
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-gray-700 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-10 w-full bg-gray-700 rounded animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-black bg-opacity-50 p-8 rounded-lg shadow-lg backdrop-blur-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Update Profile
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-300 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-300 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-300 font-semibold mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="profilePicture"
              className="block text-gray-300 font-semibold mb-2"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          {userData.profilePictureUrl && (
            <div className="mb-4">
              <p className="text-gray-300 font-semibold mb-2">Current Profile Picture:</p>
              <img src={userData.profilePictureUrl} alt="Current profile" className="w-32 h-32 object-cover rounded-full border-2 border-blue-500" />
            </div>
          )}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </motion.button>
        </form>

        <motion.button
          onClick={handleDelete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 rounded-md hover:from-red-700 hover:to-pink-700 transition-all duration-300 mt-4"
        >
          Delete Account
        </motion.button>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}
        {successMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-green-500 text-center"
          >
            {successMessage}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default UpdateProfile;

