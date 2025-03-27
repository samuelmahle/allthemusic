import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import SongCard from "../components/SongCard";

const Favorites = () => {
  const { currentUser } = useAuth();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(collection(db, "songs"), (snapshot) => {
      const userFavorites = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((song) => song.favoritedBy?.includes(currentUser.uid));
      setSongs(userFavorites);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredSongs = songs.filter((song) =>
    (song.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (song.artist?.toLowerCase() || "").includes(search.toLowerCase())
  );

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full sm:w-1/2 mb-4"
        />
      )}
      <>
        {filteredSongs.length === 0 ? (
          <p className="text-gray-400">You haven't favorited any songs yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </>
    </div>
  );
};

export default Favorites;