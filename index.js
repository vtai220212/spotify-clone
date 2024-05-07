const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "F8_PLAYER";
const heading = $("header h3");
const cdThumb = $(".cd-thumb");
const singerCurrent = $("header span");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const thumbCurrent = $(".thumb-current");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Butter Fly",
      singer: "Afterglow",
      path: "assets/music/song1.mp3",
      image: "./assets/img/afterglow.webp",
    },
    {
      name: "Dreamin Chuchu",
      singer: "Pastel Palettes x Kanon",
      path: "assets/music/song2.mp3",
      image: "./assets/img/pastel.png",
    },
    {
      name: "Haruhikage",
      singer: "MyGO!!!!!",
      path: "assets/music/song3.mp3",
      image: "./assets/img/mygo.webp",
    },
    {
      name: "Wingbeat",
      singer: "Morfonica",
      path: "assets/music/song4.mp3",
      image: "./assets/img/morfonica.webp",
    },
    {
      name: "「僕は…」",
      singer: "MyGO!!!!!",
      path: "assets/music/song5.mp3",
      image: "./assets/img/mygo.webp",
    },
    {
      name: "FIRE BIRD",
      singer: "Roselia",
      path: "assets/music/song6.mp3",
      image: "./assets/img/roselia.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                              <div class="song ${
                                index === this.currentIndex ? "active" : ""
                              }" data-index='${index}'>
                                   <div class="thumb"
                                        style="background-image: url('${
                                          song.image
                                        }')">
                                   </div>
                                   <div class="body">
                                        <h3 class="title">${song.name}</h3>
                                        <p class="author">${song.singer}</p>
                                   </div>
                                 
                              </div>
                         `;
    });
    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
    };
    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
    };
    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    // Xử lý khi tua song
    progress.oninput = function () {
      const seekTime = (audio.duration / 100) * progress.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
    };
    // Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
    };
    // Random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    // Xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    //  Xử lý khi repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    // Lắng nghe click vào playlist
    playlist.onclick = function (e) {
      if (e.target.closest(".song:not(.active)")) {
        _this.currentIndex = Number(
          e.target.closest(".song:not(.active)").getAttribute("data-index")
        );
        _this.loadCurrentSong();
        _this.render();
        audio.play();
      }
    };
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    audio.src = this.currentSong.path;
    singerCurrent.textContent = this.currentSong.singer;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
  },
  // Next Song
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  // Previous Song
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  // Random Song
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  // Repeat Song
  repeatSong: function () {},

  start: function () {
    // định nghĩa các thuộc tính cho object
    this.defineProperties();
    // lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();
    // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    // render playlist
    this.render();
  },
};

app.start();
