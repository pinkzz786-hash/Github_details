
import { useState } from 'react';
import styles from './Github.module.css';

function GitHubDetails() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    const name = username.trim();

    if (!name) {
      setUser(null);
      setError('Please enter a GitHub username.');
      return;
    }

    setError('');
    setUser(null);
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.github.com/users/${name}`
      );

      if (!response.ok) {
        setError('User not found. Please try another username.');
        return;
      }

      const data = await response.json();
      setUser(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>GitHub User Finder</h1>

        <p className={styles.subtitle}>
          Search a GitHub username to see profile details.
        </p>

        <form onSubmit={handleSearch}>
          <div className={styles.searchRow}>
            <input
              type="text"
              name="username"
              placeholder="e.g. torvalds, gaearon, octocat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button
              className={styles.searchButton}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {!user && !error && !loading && (
          <p className={styles.message}>
            No user yet. Try searching for “octocat”.
          </p>
        )}

        {user && (
          <div className={styles.profile}>
            <img
              className={styles.avatar}
              src={user.avatar_url}
              alt={`${user.login} avatar`}
            />

            <div className={styles.profileInfo}>
              <h2>
                {user.name || user.login}{' '}
                <span>@{user.login}</span>
              </h2>

              <div className={styles.stats}>
                <span>{user.public_repos} Repos</span>
                <span>{user.followers} Followers</span>
                <span>{user.following} Following</span>
              </div>

              <div className={styles.details}>
                {user.location && <span>📍 {user.location}</span>}
                {user.company && <span>🏢 {user.company}</span>}
                {user.blog && (
                  <a
                    href={
                      user.blog.startsWith('http')
                        ? user.blog
                        : `https://${user.blog}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    🔗 {user.blog}
                  </a>
                )}
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  👤 View on GitHub
                </a>
              </div>

              {user.bio && (
                <p className={styles.bio}>{user.bio}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GitHubDetails;
