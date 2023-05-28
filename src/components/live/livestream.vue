<template>
  <v-card dark>
    <div class="dsgvo-consent" v-if="!dsgvoConstent">
      <h2>Livestream laden: Datenschutz Zustimmung erforderlich</h2>
      <p>
        Der Livestream wird extern über YouTube geladen. Du musst daher aktiv
        zustimmen um den Livestream hier anzuschauen.
      </p>
      <p>
        Mehr Informationen dazu findest Du in unserer
        <a
          style="color: #34ad6f; text-decoration: none; cursor: pointer"
          href="https://blackforesttales.com/datenschutz/"
          target="_blank"
          >Datenschutzerklärung.</a
        >
      </p>
      <v-btn
        style="margin-top: 20px"
        color="#34ad6f"
        @click="dsgvoConstent = true"
        >Akzeptieren</v-btn
      >
    </div>

    <div v-if="dsgvoConstent">
      <iframe
        v-if="streamLink !== undefined && streamLink !== '' && !mobile"
        class="stream"
        frameborder="0"
        :src="build ? streamLink + '?autoplay=1' : streamLink"
        allowfullscreen
      ></iframe>
      <div v-else>
        <h1>Video leider nicht verfügbar</h1>
        <img src="../../assets/error.png" />
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  components: {},

  props: {
    streamLink: String,
  },

  name: "liveStrean",

  computed: {},

  created() {
    window.addEventListener("resize", this.resize);
  },

  data() {
    return {
      dsgvoConstent: false,
      mobile: false,
      build: false,
    };
  },

  mounted() {
    this.resize();

    this.build = process.env.NODE_ENV === "deployment";

    // procedure which run after site loaded
    // this.interval = setInterval(() => this.updateAvg(), 100);
  },

  methods: {
    resize() {
      this.mobile =
        window.getComputedStyle(document.getElementById("stream-container"))
          .display === "none";
    },
  },
};
</script>

<style>
.stream {
  width: 100%;
  height: 38vw;
}

.dsgvo-consent {
  text-align: center;
  vertical-align: middle;
  width: 100%;
  height: 38vw;
  padding-top: 15vw;
}
</style>
