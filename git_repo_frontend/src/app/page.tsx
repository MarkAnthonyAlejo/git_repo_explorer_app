'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
        alert(data.error || 'Login failed');
        return;
      }

      alert('Login successful');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/homePage');
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong');
    } finally {
      setLoading(false)
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* GitHub-style dark header */}
      <div className="w-full bg-gray-900 py-4">
        <h1 className="text-white text-center text-2xl font-semibold">GitRepo Explorer</h1>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm mt-8 bg-white border border-gray-200 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign in to your account</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Username input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="username"
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Submit button with loader */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
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

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push('/signupPage')}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </main>
  );
}
