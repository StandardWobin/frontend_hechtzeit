<template>
  <div class="applaus">
    <Transition>
      <div class="icon" :id="id" v-if="show" :src="data">
        <v-icon size="100" color="#fff">mdi-hand-clap</v-icon>
        <h2 style="color: #fff; text-align: center">{{ user }}</h2>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: "webStageSimplePusher",

  props: {
    user: String,
    data: Number,
    timer: Number,
    id: Number,
  },

  data() {
    return {
      show: true,
      x: 0,
      y: 0,
      audioBlob: undefined,
      audio: undefined,
      playing: false,
    };
  },

  methods: {
    play() {
      const claps = {
        0: "clap1.wav",
        1: "clap2.wav",
        2: "clap3.wav",
        3: "clap4.wav",
        4: "clap5.wav",
        5: "clap6.wav",
        6: "clap7.wav",
        7: "clap8.wav",
        8: "clap9.wav",
        9: "clap10.wav",
        10: "clap11.wav",
        11: "clap12.wav",
        12: "clap13.wav",
        13: "clap14.wav",
        14: "clap15.wav",
        15: "clap16.wav",
        16: "clap17.wav",
        17: "clap18.wav",
        18: "clap19.wav",
        19: "clap20.wav",
      };
      const randomAudioUrl =
        "/audio/claps/" + claps[Math.floor(Math.random() * 19)];
      this.audio = new Audio(randomAudioUrl);

      this.audio.addEventListener("ended", () => {
        this.playing = false;
        this.audio.stop();
      });

      this.audio.play();
      this.playing = true;
    },
  },

  mounted() {
    setTimeout(() => {
      this.x = Math.floor((Math.random() - 0.5) * 2 * 500);
      this.y = Math.floor((Math.random() - 0.5) * 2 * 500);

      var el = document.getElementById(this.id);
      el.style.setProperty(
        "transform",
        "translate(" + this.x + "%, " + this.y + "%)"
      );
      this.play();

      setTimeout(() => {
        this.show = false;
      }, this.timer);
    }, 50);
  },

  unmounted() {
    //this.stop();
  },

  beforeDestroy() {
    console.log("suicide");
  },
};
</script>

<style>
.icon {
  position: fixed;
  left: 50vw;
  top: 50vh;
  z-index: 100;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.applaus {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  z-index: 0;
}
</style>
