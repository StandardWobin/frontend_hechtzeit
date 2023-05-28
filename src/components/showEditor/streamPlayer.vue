<template>
  <div>
    <v-toolbar class="stream-header">
      <h3>Livestream&nbsp;</h3>
      <v-icon v-if="dsgvoConstent" @click="dsgvoConstent = false"
        >mdi-close</v-icon
      >
    </v-toolbar>

    <div v-if="!dsgvoConstent">
      <p>
        Der Livestream wird extern über YouTube geladen. Du musst daher aktiv
        zustimmen um den Livestream hier anzuschauen.
      </p>
      <p>
        Mehr Informationen dazu findest Du in unserer
        <a
          style="color: #34ad6f; text-decoration: none; cursor: pointer"
          href="XXXX"
          target="_blank"
          >Datenschutzerklärung.</a
        >
      </p>
      <v-btn large class="button" color="#34ad6f" @click="dsgvoConstent = true"
        >Akzeptieren</v-btn
      >
    </div>

    <iframe
      v-else
      id="stream"
      class="stream"
      :src="stream_link"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      scrolling="no"
      style="width: 100%; height: 35vh"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "streamPlayer",
  components: {},
  props: {
    stream_link: String,
  },

  computed: {},

  data() {
    return {
      dsgvoConstent: false,
    };
  },
  mounted() {
    // procedure which run after site loaded
  },

  methods: {},
};
</script>

<style>
.button {
  left: 50%;
  margin-top: 20px;
  margin-bottom: 20px;
}
.stream {
  width: 100%;
  height: 35%;
}
</style>
