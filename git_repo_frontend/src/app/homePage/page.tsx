'use client';

import { useEffect, useState } from 'react';
import { Repo } from '../types/repo'; // adjust path if needed
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const [username, setUsername] = useState('');
    const [githubUsername, setGithubUsername] = useState('');
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [favoriteMessage, setFavoriteMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Get the username from localStorage
        const user = localStorage.getItem('user');
        if (user) {
            const parsed = JSON.parse(user);
            const storedUsername = parsed.user_metadata?.username || parsed.username;
            setUsername(storedUsername)
        }
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setFavoriteMessage('');
        setRepos([]);

        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }

            const data: Repo[] = await response.json();
            setRepos(data);
        } catch (err) {
            setError('Error fetching repositories');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveFavorite = async (repo: Repo) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/favoriteRepo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: repo.name,
                    description: repo.description,
                    starCount: repo.stargazers_count,
                    link: repo.html_url,
                    language: repo.language,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save favorite');
            setFavoriteMessage(`Saved "${repo.name}" to favorites!`);
        } catch (err) {
            setError('Failed to save favorite');
        }
    };

    return (
        <main style={{backgroundColor: '#0A1117', color: '#DBF3F5'}} className="min-h-screen p-6 bg-gray-100">
            {/* Welcome message */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold">Welcome {username}</h1>
            </div>

            {/* GitHub Repo Search */}
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Search GitHub Repositories</h2>
                <button
                    onClick={() => router.push('/favoritePage')}
                    className="mb-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    Favorites
                </button>

                <div className="mb-6 flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter GitHub username"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        className="flex-grow p-2 border rounded"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
                    >
                        Search
                    </button>
                </div>

                {loading && <p>Loading repositories...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {favoriteMessage && <p className="text-green-600 mb-4">{favoriteMessage}</p>}

                <ul>
                    {repos.map((repo) => (
                        <li
                            key={repo.id}
                            className="bg-white p-4 mb-4 rounded shadow flex flex-col sm:flex-row sm:justify-between"
                        >
                            <div>
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xl font-semibold text-blue-600 hover:underline"
                                >
                                    {repo.name}
                                </a>
                                <p className="text-gray-700">{repo.description || 'No description'}</p>
                                <p className="text-sm text-gray-500">
                                    ⭐ Stars: {repo.stargazers_count} | Language: {repo.language || 'N/A'}
                                </p>
                            </div>
                            <button
                                onClick={() => handleSaveFavorite(repo)}
                                className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 self-start sm:self-center"
                            >
                                Save
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
