<template>
  <div class="audio-dunkle-macht-bg">
    <div class="audio-dunkle-macht"></div>
    <Transition>
      <div v-if="playing">
        <h1 class="whiteFont">{{ user }}</h1>
        <v-icon color="#FFF">mdi-volume-high</v-icon>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: "webStageSimpleSound",

  props: {
    user: String,
    data: ArrayBuffer,
  },

  data() {
    return {
      audioBlob: undefined,
      audio: undefined,
      playing: false,
    };
  },
  mounted() {
    this.play();
  },
  unmounted() {
    this.stop();
    this.audioBlob = undefined;
    this.audio = undefined;
    this.playing = undefined;
    // this.data = undefined; you might want to clear it that way
  },
  beforeDestroy() {
    this.$root.$el.parentNode.removeChild(this.$root.$el);
  },
  methods: {
    play() {
      this.audioBlob = new Blob([this.data]);
      const audioUrl = URL.createObjectURL(this.audioBlob);
      this.audio = new Audio(audioUrl);

      this.audio.addEventListener("ended", () => {
        this.playing = false;
      });

      this.audio.play();
      this.playing = true;
    },
    stop() {
      this.audio.pause();
      this.audioBlob = undefined;
      this.audio = undefined;
      this.playing = false;
    },
  },
};
</script>

<style>
.whiteFont {
  color: #fff;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.audio-dunkle-macht {
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.audio-dunkle-macht-bg {
  height: 100vh;
  animation-name: glow;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}

@keyframes glow {
  0% {
    background-color: #fff;
  }
  50% {
    background-color: rgb(177, 59, 59);
  }
  100% {
    background-color: #fff;
  }
}
</style>
