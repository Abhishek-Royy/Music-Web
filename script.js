console.log("Hello");

let currentSong = new Audio();
let play = document.querySelector("#play");

// Convert the song time
const SecondToMinutes = (second) => {
  if (isNaN(second) || second < 0) {
    return "Invalid Input";
  }
  const minutes = Math.floor(second / 60);
  const remSecond = Math.floor(second % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSecond = String(remSecond).padStart(2, "0");

  return `${formattedMinutes}:${formattedSecond}`;
};

const getSongs = async () => {
  try {
    let response = await fetch("http://127.0.0.1:5500/songs/");
    let data = await response.text();

    let divs = document.createElement("div");
    divs.innerHTML = data;
    let allDatas = divs.getElementsByTagName("a");

    let songs = [];
    for (let i = 0; i < allDatas.length; i++) {
      let element = allDatas[i];

      if (element.href.endsWith(".mp3")) {
        songs.push(element.href.split("/songs/")[1]);
      }
    }

    return songs;
  } catch (error) {
    console.log("Error in fetch", error);
  }
};

// For play the songs
const playMusic = (track) => {
  currentSong.src = "/songs/" + track;
  currentSong.play();
  play.classList.remove("ri-play-line");
  play.classList.add("ri-pause-line");
  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

// The master function
const allSongs = async () => {
  let songs = await getSongs();
  let songUl = document.querySelector(".head-2").getElementsByTagName("ul")[0];

  for (const song of songs) {
    let decodedSongName = decodeURIComponent(song.replace("%20", " "));
    songUl.insertAdjacentHTML(
      "beforeend",
      `<li>
        <div>
          <div id="song-name">${decodedSongName}</div>
          <div id="artist-name">Abhishek Roy</div>
        </div>
        <i class="ri-play-line play" id="playKey"></i>
      </li>`
    );
  }

  //Get all the  songs with attach
  Array.from(document.querySelector(".head-2").querySelectorAll("li")).forEach(
    (e) =>
      e.addEventListener("click", (elem) => {
        playMusic(
          e.getElementsByTagName("div")[0].querySelector("#song-name").innerHTML
        );
      })
  );

  //Play,previous,next for all the songs

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.classList.remove("ri-play-line");
      play.classList.add("ri-pause-line");
    } else {
      currentSong.pause();
      play.classList.remove("ri-pause-line");
      play.classList.add("ri-play-line");
    }
  });

  // Update the time while play the song
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${SecondToMinutes(
      currentSong.currentTime
    )}/${SecondToMinutes(currentSong.duration)}`;

    //Seekbar
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
};

allSongs();
