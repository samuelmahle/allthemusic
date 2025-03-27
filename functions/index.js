const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

const SOUNDCLOUD_CLIENT_ID = "wTNCzjWctauhUJtUoQeXi9tLTw3rqGbN";

exports.autoLinkSoundCloud = functions.firestore
  .document("songs/{songId}")
  .onCreate(async (snap, context) => {
    const song = snap.data();
    const songId = context.params.songId;

    if (song.soundcloudUrl) return null;
    if (!song.artist || !song.title) return null;

    const query = encodeURIComponent(song.artist + " " + song.title);
    const url = "https://api-v2.soundcloud.com/search/tracks?q=" + query +
                "&client_id=" + SOUNDCLOUD_CLIENT_ID + "&limit=10";

    try {
      const res = await fetch(url);
      const data = await res.json();

      const results = (data.collection || []).filter(item =>
        item.user?.username?.toLowerCase().includes(song.artist.toLowerCase())
      );

      if (results.length > 0) {
        const bestMatch = results.find(
          item =>
            item.title.toLowerCase().includes(song.title.toLowerCase()) &&
            item.user?.username.toLowerCase().includes(song.artist.toLowerCase())
        ) || results[0];

        await db.collection("songs").doc(songId).update({
          soundcloudUrl: bestMatch.permalink_url
        });
      }
    } catch (error) {
      console.error("SoundCloud auto-link error:", error.message);
    }

    return null;
  });

exports.searchSoundCloudMatches = functions.https.onCall(async (data, context) => {
  const { artist, title } = data;
  if (!artist || !title) {
    throw new functions.https.HttpsError("invalid-argument", "Missing artist or title");
  }

  const query = encodeURIComponent(artist + " " + title);
  const url = "https://api-v2.soundcloud.com/search/tracks?q=" + query +
              "&client_id=" + SOUNDCLOUD_CLIENT_ID + "&limit=5";

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.collection.slice(0, 3);
  } catch (error) {
    throw new functions.https.HttpsError("unknown", "SoundCloud search failed");
  }
});