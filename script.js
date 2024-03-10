console.log("Hello");

let currentSong = new Audio();
let songs;
let play = document.querySelector("#play");
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");

// Convert the song time
const SecondToMinutes = (second) => {
  if (isNaN(second) || second < 0) {
    return "00:00";
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
  songs = await getSongs();
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

    //Seekbar Circle
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Add eventListner to the seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add eventListner for previous & next
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }

    console.log(currentSong.src.split("/").slice(-1)[0]);
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }

    console.log(currentSong.src.split("/").slice(-1)[0]);
  });
};

allSongs();
