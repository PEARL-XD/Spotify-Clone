window.onload = function () {
  // Revealing the body only after everything is loaded
  document.body.style.display = "block";
};

// Querying necessary DOM elements
const songList = document.getElementById("song-list");
const signBtn = document.getElementById("sign-in-btn");
const loginBtn = document.getElementById("login-btn");
const currenttime = new Date().getTime(); // Current timestamp
const userlogbtn = document.getElementById("userlog");
const dropdown = document.getElementsByClassName("dropdown")[0];
const addbar = document.querySelector(".add");
const user = localStorage.getItem("userData");
const righthide = document.querySelector(".righthide");
const lefthide = document.querySelector(".lefthide");
const toggle = document.querySelector(".toggle");
const about = document.querySelector("#ddacc");
const playbar = document.querySelector(".playbar");
const foldersDiv = document.getElementById("folders");
const songsDiv = document.getElementById("songs-append");
const albumname = document.querySelector(".liked");
const rightalbum = document.querySelector(".rr");
const homebtn = document.querySelector(".home-btn");
const logoutbtn = document.querySelector("#ddlogout");
const pause = document.querySelector(".playpause");
const play = document.querySelector(".play");
const next_btn = document.querySelector(".next");
const previous_btn = document.querySelector("#previous");
const audio = document.querySelector("#audio");
const volume = document.querySelector("#volume-seek");
const seekbar = document.querySelector("#seekbar");
const endDuration = document.querySelector("#endduration");
const startDuration = document.querySelector("#startduration");
let song_Name = document.querySelector("#song_name");
const shuffle = document.querySelector("#shuffle");
const loop = document.querySelector(".loop");
const loopsame = document.querySelector(".loop-same");
const album_btn = document.querySelector('.album-btn')
const signUp = document.querySelector('#bottomsignup')

audio.src = ""; // Initialize audio source

// Prevent right-click context menu
document.body.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});

// User login status check
let loggedin = false;
function isloggedin() {
  const user = localStorage.getItem("userData");
  if (user) {
    let userdata = JSON.parse(user);
    let timediff = currenttime - userdata.time;
    if (timediff < 10 * 24 * 60 * 60 * 1000) {
      loggedin = true;
    }
    if (loggedin) {
      // Customize the UI for logged-in users
      signBtn.style.display = "none";
      loginBtn.style.display = "none";
      addbar.style.display = "none";
      userlogbtn.style.display = "inline-block";
      let name = userdata.email.charAt(0);
      userlogbtn.innerText = name.toUpperCase();
      lefthide.style.display = "none";
    }
  } else {
    // User is not logged in
    console.log("You are not logged in. Please sign up.");
    toggle.style.display = "none";
    playbar.style.display = "none";
  }
}

isloggedin(); // Check login status on page load

// Log out functionality
logoutbtn.addEventListener("click", function () {
  localStorage.removeItem("userData");
  location.reload();
});

// Navigate to home
homebtn.addEventListener("click", function () {
  rightalbum.style.display = "none";
  righthide.style.display = "block";
});

// Toggle user dropdown
if (userlogbtn) {
  userlogbtn.addEventListener("click", () => {
    dropdown.style.display = "flex";
  });
}
window.onclick = function (event) {
  if (!event.target.matches("#userlog") && dropdown.style.display === "flex") {
    dropdown.style.display = "none";
  }
};

// Folder and song management variables
let currindex = 0; // Tracks the currently playing song index
let currentSongs = []; // Stores the list of songs in the current folder
let currentFolder = ""; // Stores the current folder name
let defaultfolder = ""; // Default folder
let defaultsong = ""; // Default song

// Fetch and display folders
async function loadFolders() {
  try {
    const response = await fetch("/folders");
    const folders = await response.json();

    defaultfolder = folders[0]; // Set default folder
    loadSongs(defaultfolder); // Load songs from the default folder

    folders.forEach((folder) => {
      const folderElement = document.createElement("div");
      folderElement.innerHTML = `<img src="img/liked.png" alt=""> ${folder}`;
      folderElement.className = "folder";

      folderElement.addEventListener("click", function () {
        albumname.innerHTML = `<img src="img/liked.png" alt=""> ${folder}`;
        loadSongs(folder);
        righthide.style.display = "none";
        rightalbum.style.display = "inline-block";
      });

      foldersDiv.appendChild(folderElement); // Add folder to UI
    });
  } catch (error) {
    console.error("Error fetching folders:", error);
  }
}
loadFolders(); // Initialize folders

// Fetch and display songs in a folder
async function loadSongs(folderName) {
  try {
    const response = await fetch(`/folders/${folderName}`);
    const songs = await response.json();

    // Update global state
    currentSongs = songs;
    currentFolder = folderName;
    currindex = 0; // Reset index when a new folder is loaded
    defaultsong = songs[0];

    songsDiv.innerHTML = ""; // Clear previous songs
    songs.forEach((song, index) => {
      const songElement = document.createElement("div");
      songElement.className = "song";
      songElement.innerHTML = `<div class="index">${index + 1}.</div> 
                               <img src="img/liked.png" alt=""> ${song.slice(
                                 0,
                                 -4
                               )}`;

      songElement.addEventListener("click", function () {
        play.style.display = "none";
        pause.style.display = "block";
        currindex = index;
        song_Name.innerText = song.slice(0, 20);
        playsong(folderName, song);
      });

      songsDiv.appendChild(songElement);
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}
// Next song logic
function playNextSong() {
  if (currindex < currentSongs.length - 1) {
    play.style.display = "none";
    pause.style.display = "block";
    currindex++;
    song_Name.innerText = currentSongs[currindex].slice(0, 10);
    playsong(currentFolder, currentSongs[currindex]);
  } else if (currindex === currentSongs.length - 1) {
    play.style.display = "none";
    pause.style.display = "block";
    currindex = 0;
    song_Name.innerText = currentSongs[currindex].slice(0, 10);

    playsong(currentFolder, currentSongs[currindex]);
  }
}

// Previous song logic
function playPreviousSong() {
  if (currindex > 0) {
    play.style.display = "none";
    pause.style.display = "block";
    currindex--;
    song_Name.innerText = currentSongs[currindex].slice(0, 10);
    playsong(currentFolder, currentSongs[currindex]);
  } else if (currindex === 0) {
    play.style.display = "none";
    pause.style.display = "block";
    currindex = currentSongs.length - 1;
    song_Name.innerText = currentSongs[currindex].slice(0, 10);
    playsong(currentFolder, currentSongs[currindex]);
  }
}
// loop song logic
let loopcount = 0;
loop.addEventListener("click", function () {

  loopcount +=1
  if (loopcount === 1) {
    loop.style.fill = "#56d556";
  }
  else if (loopcount === 2 ) {
    loop.style.display='none'
    loopsame.style.fill = "#56d556";
    loopsame.style.display='block'
  }
});
loopsame.addEventListener('click',function () {
    loopcount += 1
    if (loopcount >2) {
      loopsame.style.display='none'
      loop.style.fill = "#b3b3b3";
      loop.style.display='block'
      loopcount = 0
    }
})
// shuffle song logic 
let shufflecount = 0 
shuffle.addEventListener('click',function() {
  if (shufflecount === 0) {
    shuffle.style.fill='#56d556'
    shufflecount =1 
  }
  else if (shufflecount = 1 ) {
    shuffle.style.fill='#b3b3b3'
    shufflecount = 0
  }
})
// Runs with both loop and shuffle 
audio.addEventListener("ended", () => {
  if (loopcount === 1 ) {
    playNextSong();
  }else if (loopcount === 2) {
    audio.currentTime = 0;
    audio.play();
  }else if (loopcount ===3) {
    audio.pause()
  }
  else if (shufflecount === 1) {
    let randomIndex = Math.floor(Math.random() * currentSongs.length)
    playsong(currentFolder,currentSongs[randomIndex])
    
  }
});

// Play a specific song
function playsong(folder, song) {
  audio.pause();
  audio.src = `/songs/${folder}/${song}`;
  audio.load();
  audio.play();
}
// album-btn song logic 
album_btn.addEventListener('click',function () {
  play.style.display = "none";
  pause.style.display = "block";
  playsong(currentFolder,currentSongs[0])
  
})
// Formatting time
function formatTime(totalSeconds) {
  let min = Math.floor(totalSeconds / 60);
  let sec = Math.floor(totalSeconds % 60);
  let formattedMin = min.toString().padStart(2, "0");
  let formattedSec = sec.toString().padStart(2, "0");
  return `${formattedMin}:${formattedSec}`;
}

// Updates audio duration on metadata load
audio.onloadedmetadata = () => {
  endDuration.innerHTML = formatTime(audio.duration);
};

// Updates current time dynamically and seekbar
audio.addEventListener("timeupdate", function () {
  let currentTime = audio.currentTime;
  startDuration.innerHTML = formatTime(currentTime);

  // Update the seek bar
  if (audio.duration > 0) {
    let seekValue = (currentTime / audio.duration) * 100;
    seekbar.value = seekValue;
  }
});

// Add event listeners for Next and Previous buttons
next_btn.addEventListener("click", playNextSong);
previous_btn.addEventListener("click", playPreviousSong);
if (audio.currentTime > 0 && !audio.paused && !audio.ended) {
  console.log("Audio is playing");
} else {
  console.log("Audio is not playing");
}

play.addEventListener("click", function () {
  if (
    audio.src === "" ||
    audio.src === undefined ||
    audio.src === "http://localhost:3000/" ||
    audio.src === "http://localhost:3000/index.html"
  ) {
    play.style.display = "none";
    pause.style.display = "block";
    song_Name.innerText = defaultsong.slice(0, 10);
    playsong(defaultfolder, defaultsong);
    console.log("No song selected, playing default song");
  } else {
    if (audio.paused) {
      console.log("playing");

      play.style.display = "none";
      pause.style.display = "block";
      audio.play();
    } else {
      pause.style.display = "none";
      play.style.display = "block";
      console.log("jwdnb");

      audio.pause();
    }
  }
});

pause.addEventListener("click", function () {
  if (!audio.pasued) {
    audio.pause();
    pause.style.display = "none";
    play.style.display = "block";
  }
});
volume.addEventListener("input", function () {
  audio.volume = this.value;
});

// Function to update the seek bar color based on the slider value
function updateSeekBar() {
  const value = volume.value * 100; // Convert to percentage (0 to 100)
  volume.style.background = `linear-gradient(to right, white ${value}%, #4d4d4d ${value}%)`;
}

// Initialize the seek bar color on page load

updateSeekBar();

// Update the seek bar color dynamically when the slider value changes

volume.addEventListener("input", function () {
  // Keep the color green when sliding

  volume.style.background = `linear-gradient(to right, #4CAF50 ${
    volume.value * 100
  }%, #4d4d4d ${volume.value * 100}%)`;
});

// Handle hover effects

volume.addEventListener("mouseenter", function () {
  // Change the background to green on hover

  volume.style.background = `linear-gradient(to right, #4CAF50 ${
    volume.value * 100
  }%, #4d4d4d ${volume.value * 100}%)`;
});

volume.addEventListener("mouseleave", function () {
  // If not sliding, reset the color to white

  updateSeekBar();
});

let hover = false;

function updatePlay() {
  const progress = (audio.currentTime / audio.duration) * 100 || 0; // Calculate progress as percentage

  if (!hover) {
    // Only update the background when not hovering
    seekbar.value = progress; // Update seek bar value
    seekbar.style.background = `linear-gradient(to right, white ${progress}%, #4d4d4d ${progress}%)`;
  }
}

if (audio) {
  // Ensure both audio and seekbar are defined
  seekbar.addEventListener("input", function () {
    const seekTime = (seekbar.value / 100) * audio.duration; // Calculate the seek time
    audio.currentTime = seekTime; // Update the audio playback time
    // Update the seekbar background
    seekbar.style.background = `linear-gradient(to right, #4CAF50 ${seekbar.value}%, #4d4d4d ${seekbar.value}%)`;
  });

  // Synchronize the playback with the seek bar on time updates
  audio.addEventListener("timeupdate", updatePlay);

  // Initialize the seek bar when metadata is loaded
  audio.addEventListener("loadedmetadata", updatePlay);

  // Reset the seek bar when the audio ends
  audio.addEventListener("ended", function () {
    seekbar.value = 0; // Reset seek bar to the beginning
    seekbar.style.background = `linear-gradient(to right, #4CAF50 0%, #4d4d4d 100%)`;
  });

  // Change seekbar background to white on mouse hover
  seekbar.addEventListener("mouseenter", function () {
    hover = true;
    const progress = (audio.currentTime / audio.duration) * 100 || 0; // Calculate progress as percentage
    seekbar.style.background = `linear-gradient(to right, #4CAF50 ${progress}%, #4d4d4d ${progress}%)`;
    hoverinterval = setInterval(() => {
      const progress = (audio.currentTime / audio.duration) * 100 || 0; // Calculate progress as percentage
      seekbar.style.background = `linear-gradient(to right, #4CAF50 ${progress}%, #4d4d4d ${progress}%)`;
    }, 50);
  });

  // Revert to green progress when the mouse leaves the seekbar
  seekbar.addEventListener("mouseleave", function () {
    hover = false;
    updatePlay(); // Revert the seekbar to green progress on mouse leave
    clearInterval(hoverinterval);
  });
}

// Initially set the seekbar background and value
updatePlay();
about.addEventListener("click", function () {
  alert("THIS IS CLONE WHAT DO YOU EXPECT ");
});

