import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';
import SongCard from '../components/SongCard';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');
  const [showUpcoming, setShowUpcoming] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(collection(db, 'songs'), (snapshot) => {
      const songsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          favoritedBy: data.favoritedBy || [],
          ...data,
        };
      });

      
      // Sort by trending: songs with most recent favorites (within 7 days)
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);

      songsData.sort((a, b) => {
        const aRecent = (a.favoritedAt || []).filter(ts => {
          const date = ts?.toDate ? ts.toDate() : new Date(ts);
          return date >= weekAgo;
        }).length;

        const bRecent = (b.favoritedAt || []).filter(ts => {
          const date = ts?.toDate ? ts.toDate() : new Date(ts);
          return date >= weekAgo;
        }).length;

        return bRecent - aRecent;
      });



      setSongs(songsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredSongs = songs.filter((song) => {
    const title = typeof song?.title === 'string' ? song.title.toLowerCase() : '';
    const artist = typeof song?.artist === 'string' ? song.artist.toLowerCase() : '';
    const matchesSearch =
      title.includes(search.toLowerCase()) || artist.includes(search.toLowerCase());

    const rawDate = song?.releaseDate;
    let releaseDate;

    if (!rawDate && !showUpcoming) return matchesSearch;

    if (typeof rawDate === 'string' || typeof rawDate === 'number') {
      releaseDate = new Date(rawDate);
    } else if (rawDate?.toDate) {
      releaseDate = rawDate.toDate();
    } else {
      return matchesSearch;
    }

    
    const isUpcoming = dayjs(releaseDate).isBefore(dayjs().add(7, 'day')) && dayjs(releaseDate).isAfter(dayjs());


    return matchesSearch && (!showUpcoming || isUpcoming);
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by song or artist"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full sm:w-1/2"
        />    
      </div>
    <h1 className="text-2xl font-bold text-white mt-4 mb-2">🔥 Trending Songs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}