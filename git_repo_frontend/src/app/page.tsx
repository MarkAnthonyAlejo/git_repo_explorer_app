'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { FaGithub } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!formData.password || (!formData.email && !formData.username)) {
      alert('Please enter your password and either email or username.');
      return;
    }

    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Login failed');
        return;
      }

      toast.success('Login successful');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/homePage');
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false)
    }
  };

  return (
    <main style={{ backgroundColor: '#000409' }} className="min-h-screen flex flex-col items-center justify-center">
      {/* Toast Notifications */}
      <Toaster position="top-right" />

      {/* GitHub Icon Header */}
      <div className="w-full py-4 flex justify-center items-center">
        <FaGithub style={{ backgroundColor: '#228736' }} className="text-white text-8xl rounded-full" />
      </div>

      {/* Login Card */}
      <div style={{ borderColor: '#3D444D', backgroundColor: '#0C1117' }} className="w-full max-w-sm mt-8 border-4 p-8 rounded-lg shadow-lg">
        <h2 style={{ color: '#F0F6FD' }} className="text-2xl font-bold text-center mb-6">Sign in to your account</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input */}
          <div>
            <label style={{ color: '#F0F6FD' }} className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ color: '#F0F6FD' }}
              className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Username input */}
          <div>
            <label style={{ color: '#F0F6FD' }} className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{ color: '#F0F6FD' }}
              className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="username"
            />
          </div>

          {/* Password input */}
          <div>
            <label style={{ color: '#F0F6FD' }} className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              style={{ color: '#F0F6FD' }}
              className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#228736', color: '#F0F6FD' }}
            className={`w-full flex justify-center items-center font-semibold py-2 px-4 rounded hover:bg-green-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : null}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ color: '#F0F6FD' }} className="mt-6 text-center text-sm">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push('/signupPage')}
            className="text-blue-600 hover:underline"
            style={{ color: '#4493F8' }}
          >
            Sign up
          </button>
        </p>
      </div>
    </main>
  );
}
