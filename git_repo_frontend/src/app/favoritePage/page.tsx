'use client';

import { useEffect, useState } from 'react';

export default function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error fetching favorites');
        setFavorites(data.repos);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load favorites');
      });
  }, []);

  return (
    <main className="min-h-screen p-6 bg-[#0A1117]">
      <h1 className="text-3xl font-bold mb-6 text-center">Favorite Repositories</h1>
      {error && <p className="text-red-600">{error}</p>}
      <ul>
        {favorites.map((repo: any) => (
          <li
            key={repo.id}
            className="bg-[#151B23] p-4 mb-4 rounded shadow border border-[#3D444D]"
          >
            <a
              href={repo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4493F8] text-xl font-semibold text-blue-600 hover:underline"
            >
              {repo.name}
            </a>
            <p>{repo.description || 'No description'}</p>
            <p className="text-sm text-[#F0F6FD]">
              ⭐ Stars: {repo.star_count} | Language: {repo.language || 'N/A'}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
