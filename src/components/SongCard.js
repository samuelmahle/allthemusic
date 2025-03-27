import React from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

import { useNavigate } from 'react-router-dom';

export default function SongCard({ song }) {
  const { currentUser } = useAuth();

    const toggleFavorite = async () => {
    if (!currentUser) return;
    const songRef = doc(db, 'songs', song.id);
    const isFavorited = song.favoritedBy?.includes(currentUser.uid);

    try {
      const songSnap = await getDoc(songRef);
      const songData = songSnap.data();
      const updatedFavoritedBy = [...(songData.favoritedBy || [])];
      const updatedFavoritedAt = [...(songData.favoritedAt || [])];

      if (isFavorited) {
        const index = updatedFavoritedBy.indexOf(currentUser.uid);
        if (index > -1) {
          updatedFavoritedBy.splice(index, 1);
          updatedFavoritedAt.splice(index, 1);
        }
      } else {
        updatedFavoritedBy.push(currentUser.uid);
        updatedFavoritedAt.push(new Date());
      }

      await updateDoc(songRef, {
        favoritedBy: updatedFavoritedBy,
        favoritedAt: updatedFavoritedAt,
      });
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };


  const favoriteCount = song.favoritedBy?.length || 0;
  const isFavoritedByUser = currentUser && song.favoritedBy?.includes(currentUser.uid);
  const navigate = useNavigate();
  const isAdmin = currentUser?.email === "sam18mahle@gmail.com";

  let formattedDate = 'TBA';
  if (song.releaseDate) {
    try {
      const parsedDate = song.releaseDate.toDate
        ? song.releaseDate.toDate()
        : new Date(song.releaseDate);
      formattedDate = isNaN(parsedDate) ? 'TBA' : parsedDate.toLocaleDateString();
    } catch (e) {
      formattedDate = 'TBA';
    }
  }

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        {song.soundcloudUrl ? (
          <iframe
            title="SoundCloud Player"
            width="100%"
            height="120"
            allow="autoplay"
            className="rounded"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(song.soundcloudUrl)}&auto_play=false&show_user=false&hide_related=true&show_comments=false&visual=false`}
          ></iframe>
        ) : (
          <div className="w-full h-28 flex items-center justify-center bg-gray-700 rounded">
            <span className="text-gray-400 text-sm">🔗 Link not yet available</span>
          </div>
        )}
      </div>

      <h2 className="text-lg font-bold text-white mb-1">{song.title}</h2>
      <p className="text-sm italic text-pink-400 mb-1">by {song.artist}</p>

      <p className="text-xs mb-2 text-gray-300">Release Date: {formattedDate}</p>
      <p className="text-sm text-red-400 mb-2">❤️ {favoriteCount} favorite{favoriteCount !== 1 ? 's' : ''}</p>

      {isAdmin && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate(`/edit/${song.id}`)}
            className="text-xs bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this song?')) {
                import('firebase/firestore').then(({ doc, deleteDoc }) => {
                  deleteDoc(doc(db, 'songs', song.id));
                });
              }
            }}
            className="text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            ❌ Delete
          </button>
        </div>
      )}
      
      {currentUser && (
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-full"
          onClick={toggleFavorite}
        >
          {isFavoritedByUser ? '💔 Unfavorite' : '☆ Favorite'}
        </button>
      )}
    </div>
  );
}
