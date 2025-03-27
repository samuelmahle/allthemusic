import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function EditSong() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const songRef = doc(db, 'songs', id);
        const songSnap = await getDoc(songRef);
        if (songSnap.exists()) {
          const data = songSnap.data();
          setSong({
            ...data,
            releaseDate: data.releaseDate?.toDate
              ? data.releaseDate.toDate().toISOString().substr(0, 10)
              : data.releaseDate
              ? new Date(data.releaseDate).toISOString().substr(0, 10)
              : ''
          });
        } else {
          setError('Song not found.');
        }
      } catch (err) {
        console.error('Error fetching song:', err);
        setError('Failed to fetch song.');
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSong((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const songRef = doc(db, 'songs', id);
      await updateDoc(songRef, {
        title: song.title,
        artist: song.artist,
        releaseDate: song.releaseDate ? new Date(song.releaseDate) : null,
        soundcloudUrl: song.soundcloudUrl || null,
      });
      navigate('/');
    } catch (err) {
      console.error('Failed to update song:', err);
      setError('Failed to update song.');
    }
  };

  if (loading) return <div className="text-white p-4">Loading song...</div>;
  if (error) return <div className="text-red-400 p-4">{error}</div>;
  if (!song) return <div className="text-white p-4">No song data found.</div>;

  return (
    <div className="max-w-xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Song</h1>

      {song.createdBy && (
        <div className="text-sm text-gray-400 italic mb-2">
          Created by: {song.createdBy.email}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Song Title"
          value={song.title}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white"
          required
        />
        <input
          type="text"
          name="artist"
          placeholder="Artist"
          value={song.artist}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white"
          required
        />
        <input
          type="date"
          name="releaseDate"
          value={song.releaseDate}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white"
        />
        <input
          type="url"
          name="soundcloudUrl"
          placeholder="SoundCloud URL"
          value={song.soundcloudUrl || ''}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
        >
          💾 Save Changes
        </button>
      </form>
    </div>
  );
}
