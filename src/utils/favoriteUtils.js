import { collection, addDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const toggleFavorite = async (userId, songId, setUserFavorites) => {
  try {
    const favRef = collection(db, 'favorites');
    const q = query(favRef, where('userId', '==', userId), where('songId', '==', songId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Unfavorite
      snapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, 'favorites', docSnap.id));
      });
      setUserFavorites(prev => {
        const updated = { ...prev };
        delete updated[songId];
        return updated;
      });
    } else {
      // Add favorite
      await addDoc(favRef, {
        userId,
        songId,
        timestamp: serverTimestamp()
      });
      setUserFavorites(prev => ({ ...prev, [songId]: true }));
    }
  } catch (err) {
    console.error('Error toggling favorite:', err);
  }
};

export const fetchUserFavorites = async (userId, setUserFavorites) => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const favs = {};
    snapshot.forEach(doc => {
      favs[doc.data().songId] = true;
    });
    setUserFavorites(favs);
  } catch (err) {
    console.error('Error fetching user favorites:', err);
  }
};