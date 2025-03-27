import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import SongCard from '../components/SongCard';

function Favorites() {
  const { currentUser } = useAuth();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(collection(db, 'songs'), (snapshot) => {
      const allSongs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          favoritedBy: data.favoritedBy || [],
          ...data
        };
      });

      const favorites = allSongs.filter(song =>
        song.favoritedBy.includes(currentUser.uid)
      );

      setSongs(favorites);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredSongs = songs.filter(song => {
    const title = typeof song?.title === 'string' ? song.title.toLowerCase() : '';
    const artist = typeof song?.artist === 'string' ? song.artist.toLowerCase() : '';
    return title.includes(search.toLowerCase()) || artist.includes(search.toLowerCase());
  });

  if (!currentUser) {
    return <p>Please log in to view your favorites.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-white">Your Favorites</h1>
      <input
        type="text"
        placeholder="Search by song or artist"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white w-full sm:w-1/2 mb-4"
      />
      {filteredSongs.length === 0 ? (
        <p className="text-gray-400">You haven't favorited any songs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredSongs.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
