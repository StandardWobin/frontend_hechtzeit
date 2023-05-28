<template>
  <div style="display: flex">
    <div v-if="audioUrl !== undefined" @click="play()">
      <av-waveform
        ref="waviwave"
        :audio-src="audioUrl"
        :audio-controls="false"
        line-color="#34ad6f"
        played-line-color="#1d4000"
        :canv-width="300"
      ></av-waveform>
    </div>

    <v-btn @click="play()">
      <v-icon v-if="!playing">mdi-play</v-icon>
      <v-icon v-else>mdi-pause </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "feedbackVoicer",

  props: {
    data: ArrayBuffer,
  },

  data() {
    return {
      audioBlob: undefined,
      playing: false,
      audioUrl: undefined,
    };
  },

  mounted() {
    this.setup();
  },

  watch: {
    data() {
      this.setup();
    },
  },

  unmounted() {
    this.stop();
  },
  methods: {
    setup() {
      let audioBlob = new Blob([this.data]);
      this.audioUrl = URL.createObjectURL(audioBlob);
    },
    play() {
      if (this.playing) {
        this.$refs.waviwave.audio.pause();
        this.playing = false;
      } else {
        this.$refs.waviwave.audio.play();
        this.playing = true;
      }
    },
    stop() {
      this.$refs.waviwave.audio.pause();
      this.audioBlob = undefined;
      this.playing = false;
    },
  },
};
</script>

<style></style>
