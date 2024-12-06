const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const songsDir = path.join(__dirname, "music"); // Path to your "songs" folder

// Serve static files from the "public" folder (where your HTML, CSS, JS files are)
app.use(express.static("public/mainpage"));

// Serve music files
app.use("/songs", express.static(songsDir));

// Route to get list of folders (albums, etc.)
app.get("/folders", (req, res) => {
  fs.readdir(songsDir, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).send("Error reading directory");
    const folders = files
      .filter((file) => file.isDirectory())
      .map((folder) => folder.name);
    res.json(folders);
  });
});

// Route to get songs in a specific folder
app.get("/folders/:folderName", (req, res) => {
  const folderPath = path.join(songsDir, req.params.folderName);
  fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).send("Error reading folder");
    const songs = files
      .filter((file) => file.isFile() && file.name.endsWith(".mp3"))
      .map((song) => song.name);
    res.json(songs);
  }); 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

