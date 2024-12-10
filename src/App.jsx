import React, { useState, useEffect } from 'react';

async function fetchUserPosts(userId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await response.json();
  return data;
}

export default function TodoApp() {
  const [userId, setUserId] = useState(1); // Default userId
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId > 0) {
      setLoading(true);
      fetchUserPosts(userId)
        .then((data) => {
          setPosts(data);
          setError(null);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const handleInputChange = (event) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value > 0) {
      setUserId(value);
    }
  };

  const handleArrowKeys = (event) => {
    if (event.key === 'ArrowUp') {
      setUserId((prev) => prev - 1);
    } else if (event.key === 'ArrowDown' && userId > 1) {
      setUserId((prev) => prev + 1);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Posts by User</h1>
      <input
        type="number"
        value={userId}
        onChange={handleInputChange}
        onKeyDown={handleArrowKeys}
        min="1"
        style={{ fontSize: '16px', padding: '5px', width: '100px' }}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {posts.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: '10px' }}>
              {post.title}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No posts found for user ID {userId}.</p>
      )}
    </div>
  );
}
