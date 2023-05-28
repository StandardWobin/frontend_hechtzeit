<template>
  <div>
    <v-toolbar dark>
      <v-toolbar-title>{{ scene.title_texter }}</v-toolbar-title>
    </v-toolbar>

    <div class="interaction-content">
      <p>{{ scene.text_texter }}</p>

      <v-textarea
        class="area"
        clearable
        solo
        outlined
        dark
        no-resize
        auto-grow
        :rows="scene.big_texter ? 5 : 2"
        v-model="text"
        counter
        :maxlength="scene.big_texter ? 500 : 50"
        :disabled="!active"
        placeholder="Schreibe einen Text..."
      ></v-textarea>

      <v-btn @click="call(text)" :disabled="text.length == 0"
        >Abschicken&nbsp;&nbsp;<v-icon>mdi-send</v-icon></v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scene: Object,
    active: Boolean,
  },

  name: "hz_texter",

  data() {
    return {
      text: "",
    };
  },
  mounted() {},
  methods: {
    call(message) {
      this.$emit("call", this.scene, message);
      this.text = "";
    },
  },
};
</script>

<style scoped>
.interaction-content {
  padding: 3%;
  height: auto;
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: center;
}

.area {
  width: 100%;
  color: black !important;
}

.v-text-field__slot input {
  color: #00f !important;
}
</style>
