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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password || (!formData.email && !formData.username)) {
      alert('Please enter your password and either email or username.');
      return;
    }

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
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-[#0d1117] transition-colors px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-[#161b22] rounded-lg shadow-md border border-gray-300 dark:border-[#30363d]">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Sign in</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter email or leave blank"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter username or leave blank"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded-md font-medium transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push('/signupPage')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </main>
  );
}
