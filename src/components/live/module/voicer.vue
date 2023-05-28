<template>
  <div>
    <v-toolbar dark>
      <v-toolbar-title>{{ scene.title_voicer }}</v-toolbar-title>
    </v-toolbar>

    <div class="interaction-content">
      <p>{{ scene.text_voicer }}</p>

      <v-icon
        class="record-icon"
        v-if="!recording"
        :disabled="audioUrl !== undefined || !active"
        @click="record()"
        size="200"
        :class="recording ? 'blinki' : 'noblinki'"
        >mdi-microphone</v-icon
      >
      <v-icon
        class="record-icon"
        v-if="recording"
        @click="stop()"
        size="200"
        :class="recording ? 'blinki' : 'noblinki'"
        >mdi-microphone</v-icon
      >
      <div class="record-nav">
        <p v-if="recording">{{ recordTimer }} s</p>
        <v-btn v-if="recording" @click="stop()"
          ><v-icon>mdi-stop</v-icon>stop</v-btn
        >
      </div>

      <p v-if="audioUrl == undefined && !recording">
        Tippe auf das Mikrofon um die Aufnahme zu starten
      </p>

      <v-card
        v-if="audioChunks.length == 1"
        color="#070f05"
        class="audiofile"
        outlined
        rounded
        elevation="24"
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            vertical-align: middle;
          "
        >
          <div style="padding: 10px">
            <v-btn fab :disabled="audioChunks.length != 1" @click="play()">
              <v-icon v-if="!playing">mdi-play</v-icon>
              <v-icon v-else>mdi-pause</v-icon>
            </v-btn>
            <p style="font-size: 12px">{{ recordTimer }}s</p>
          </div>

          <av-waveform
            v-if="audioUrl !== undefined"
            ref="waviwave"
            :audio-src="audioUrl"
            :audio-controls="false"
            line-color="#34ad6f"
            played-line-color="#1d4000"
            :canv-width="300"
          ></av-waveform>
          <v-btn
            style="margin: auto; margin-right: 10px"
            fab
            @click="
              audioChunks = [];
              audioUrl = undefined;
            "
            ><v-icon color="#f00" small>mdi-delete</v-icon></v-btn
          >
        </div> </v-card
      ><br />
      <v-btn
        v-if="audioUrl !== undefined"
        color="#34ad6f"
        @click="
          call(audioChunks[0]);
          audioChunks = [];
          audioUrl = undefined;
        "
        :disabled="!active"
      >
        Abschicken&nbsp;&nbsp;<v-icon>mdi-send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
// import consenter from "./consenter.vue";

export default {
  name: "hz_voicer",

  props: {
    scene: Object,
    active: Boolean,
  },

  data() {
    return {
      checker: false,
      audioChunks: [],
      mediaRecorder: undefined,
      recording: false,
      recordStartTime: 0,
      recordTimer: 0,
      recordUpdateInterval: undefined,
      audio: undefined,
      playing: false,
      audioUrl: undefined,
    };
  },
  mounted() {},
  methods: {
    call(message) {
      this.$emit("call", this.scene, message);
    },

    recordTimerDisplay() {
      this.recordTimer = ((Date.now() - this.recordStartTime) / 1000).toFixed(
        2
      );
    },

    cancel() {
      this.stop();

      this.audioChunks = [];
    },
    play() {
      if (this.playing) {
        this.$refs.waviwave.audio.pause();
        this.playing = false;
      } else if (!this.playing) {
        this.$refs.waviwave.audio.addEventListener("ended", () => {
          this.playing = false;
        });
        this.playing = true;
        this.$refs.waviwave.audio.play();
      }
    },
    stop() {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    },
    record() {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.recording = true;
        this.recordStartTime = Date.now();
        this.recordUpdateInterval = setInterval(this.recordTimerDisplay, 10);
        this.mediaRecorder.addEventListener("dataavailable", (event) => {
          this.audioChunks.push(event.data);
          this.stop();
        });

        this.mediaRecorder.addEventListener("stop", () => {
          this.recording = false;
          this.recordStartTime = 0;
          const audioBlob = new Blob(this.audioChunks);
          this.audioUrl = URL.createObjectURL(audioBlob);
          clearInterval(this.recordUpdateInterval);
          this.stop();
        });
      });
    },
  },
};
</script>

<style>
.interaction-content {
  padding: 3%;
  height: auto;
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: center;
}

.blinki {
  margin-bottom: 2px;
  padding: 5px;
  animation: blink 1s infinite;
}

.noblinki {
  margin-bottom: 2px;
  padding: 5px;
}

.record-icon {
  margin: 50px;
}

.audiofile {
  border-radius: 100px !important;
}

@keyframes blink {
  from {
    color: rgb(255, 255, 255);
  }
  to {
    color: rgb(255, 0, 0);
  }
}
</style>
