<template>
  <div>
    <v-toolbar class="client-preview-header">
      <h3>Client Preview&nbsp;</h3>
      <v-slider v-model="slider" min="0" max="100">zoom</v-slider>
    </v-toolbar>

    <iframe
      class="client-preview-iframe"
      :style="'transform:scale(' + slider / 100 + ')'"
      :src="frontendLink"
      scrolling="no"
      name="Client Preview"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "theInteractionPreview",

  props: {
    frontendLink: String,
  },
  data() {
    return {
      slider: 50,
    };
  },

  methods: {},
};
</script>

<style>
.client-preview-iframe {
  width: 450px;
  margin-left: 0%;
  overflow: hidden;
  height: 800px;

  transform-origin: 0 0;
}
</style>
