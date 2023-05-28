<template>
  <div>
    <v-toolbar dark>
      <h1>imager</h1>
      <v-toolbar-title>{{ scene.title_imageup }}</v-toolbar-title>
    </v-toolbar>

    <!-- IMAGE HERE -->

    <v-file-input
      label="File input"
      v-model="image"
      outlined
      dense
      capture="user"
      :rules="rules"
      accept="image/png, image/jpeg"
    ></v-file-input>
    <v-btn @click="call(image)" :disabled="image === undefined"
      ><v-icon>mdi-send</v-icon></v-btn
    >
  </div>
</template>

<script>
export default {
  props: {
    scene: Object,
  },

  name: "hz_imager",

  data() {
    return {
      image: undefined,
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
    };
  },
  mounted() {},
  methods: {
    call(message) {
      this.$emit("call", this.scene, message);
    },
  },
};
</script>

<style></style>
