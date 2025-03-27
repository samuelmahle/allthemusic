import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Upload() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [matches, setMatches] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSearchMatches = async () => {
    if (!title || !artist) return;
    setLoadingMatches(true);
    setMatches([]);
    try {
      const functions = getFunctions();
      const searchMatches = httpsCallable(functions, 'searchSoundCloudMatches');
      const result = await searchMatches({ artist, title });
      setMatches(result.data || []);
    } catch (err) {
      console.error("Failed to fetch SoundCloud matches:", err.message);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !artist) {
      setError('Please provide both a song title and artist.');
      return;
    }
    setError('');
    if (releaseDate) {
      const parsedDate = new Date(releaseDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsedDate < today) {
        setError('Release date cannot be in the past.');
        return;
      }
    }

    const finalUrl = selectedUrl || customUrl || null;

    try {
      await addDoc(collection(db, 'songs'), {
        createdBy: { uid: currentUser.uid, email: currentUser.email },
        title,
        artist,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        soundcloudUrl: finalUrl,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error("Error uploading song:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">📤 Upload New Song</h1>
      {submitted ? (
        <div className="p-4 text-green-400 font-semibold">✅ Song uploaded successfully! Redirecting...</div>
      ) : (
        <>
          {error && <div className="bg-red-500 text-white text-sm px-4 py-2 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Song Title"
              className="w-full bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white placeholder-gray-400"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Artist"
              className="w-full bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white placeholder-gray-400"
              value={artist}
              onChange={e => setArtist(e.target.value)}
            />
            <label className="block text-sm mb-1">Release Date (optional — only include if known)</label>
            <input
              type="date"
              placeholder="MM/DD/YYYY (Optional)"
              className="w-full bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white"
              value={releaseDate}
              onChange={e => setReleaseDate(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSearchMatches}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🔍 Check SoundCloud Matches
            </button>

            {loadingMatches && <div className="text-gray-400">Searching SoundCloud...</div>}

            {selectedUrl && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">🎧 Selected Song Preview:</h2>
                <iframe
                  title="SoundCloud Preview"
                  width="100%"
                  height="120"
                  allow="autoplay"
                  className="my-2 rounded"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(selectedUrl)}&color=%23ff5500&inverse=false&auto_play=false&show_user=true`}
                ></iframe>
                <p className="text-green-400 text-sm break-all">✅ Using: {selectedUrl}</p>
              </div>
            )}

            {!selectedUrl && matches.length > 0 && (
              <div className="mt-4 space-y-3">
                <h2 className="text-lg font-semibold">🎧 Top Matches:</h2>
                {matches.map((match, idx) => (
                  <div key={idx} className="border p-3 rounded bg-gray-700">
                    <div className="font-medium">{match.title}</div>
                    <div className="text-sm text-gray-300">by {match.user.username}</div>
                    <iframe
                      title={match.title}
                      width="100%"
                      height="120"
                      allow="autoplay"
                      className="my-2"
                      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(match.permalink_url)}&color=%23ff5500&inverse=false&auto_play=false&show_user=true`}
                    ></iframe>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUrl(match.permalink_url);
                        setCustomUrl('');
                      }}
                      className="text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      ✅ Use This
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Or paste a custom SoundCloud URL (optional):</label>
              <input
                type="url"
                placeholder="https://soundcloud.com/..."
                className="w-full bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white placeholder-gray-400"
                value={customUrl}
                onChange={e => {
                  setCustomUrl(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedUrl(customUrl);
                }}
                className="text-sm mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                ✅ Use This
              </button>
            </div>

            <button
              type="submit"
              className="px-4 py-2 mt-4 bg-green-600 text-white rounded hover:bg-green-700"
            >
              🚀 Upload Song
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Upload;
