import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import SongCard from "../components/SongCard";

const Home = () => {
  const { currentUser } = useAuth();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(collection(db, "songs"), (snapshot) => {
      const songsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSongs(songsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = songs.filter((song) =>
      (song.title?.toLowerCase() || "").includes(lowerSearch) ||
      (song.artist?.toLowerCase() || "").includes(lowerSearch)
    );
    setFilteredSongs(filtered);
  }, [songs, search]);

  return (
    <div className="p-4">
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="sm:hidden bg-gray-700 text-white px-4 py-2 rounded mb-4"
      >
        Toggle Search
      </button>
      {showSearch && (
        <input
          type="text"
          placeholder="Search by song or artist"
          className="mb-4 w-full px-4 py-2 rounded bg-gray-800 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <>
        <h2 className="text-xl font-bold text-white mb-4">🔥 Trending Songs</h2>
        {loading ? (
          <p className="text-white text-center mt-10">Loading songs...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </>
    </div>
  );
};

export default Home;