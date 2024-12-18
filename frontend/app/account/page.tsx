'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
          credentials: 'include', // Make sure cookies are included
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
        setRole(data.role)
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
        body: formData, // No need to set content type manually
        credentials: 'include', // Keep using cookies for auth
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
  
      const updatedUser = await response.json();
      setUserData(updatedUser);
      setSuccessMessage('Profile updated successfully');
      router.push(`/${role}`);
  
      // Notify the user to verify the email if it's changed
      if (updatedUser.email !== userData?.email) {
        setSuccessMessage('Profile updated successfully. Please verify your new email address.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-md shadow-md">
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700 dark:text-gray-200">
          Update Profile
        </h1>
        <form onSubmit={handleSubmit}>
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
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-600 dark:text-gray-300 font-semibold mb-2"
            >
              New Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="profilePicture"
              className="block text-gray-600 dark:text-gray-300 font-semibold mb-2"
            >
              Profile Picture:
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          {userData.profilePictureUrl && (
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300 font-semibold mb-2">Current Profile Picture:</p>
              <img src={userData.profilePictureUrl} alt="Current profile" className="w-32 h-32 object-cover rounded-full" />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-red-500 dark:text-red-400 text-center">{error}</p>
        )}
        {successMessage && (
          <p className="mt-4 text-green-500 dark:text-green-400 text-center">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;
