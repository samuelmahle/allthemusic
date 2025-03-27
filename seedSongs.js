// seedSongs.js
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");

// 👇 Replace with your actual filename if you didn’t rename it
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Load songs from JSON file
const songs = JSON.parse(fs.readFileSync("edm_seed_songs.json", "utf8"));

async function seedSongs() {
  const batch = db.batch();
  const collectionRef = db.collection("songs");

  songs.forEach((song) => {
    const docRef = collectionRef.doc(); // auto-ID
    batch.set(docRef, {
      title: song.title,
      artist: song.artist,
      coverArtUrl: song.coverArtUrl,
      description: song.description,
      createdAt: new Date()
    });
  });

  await batch.commit();
  console.log("🔥 Seeded songs to Firestore");
}

seedSongs();