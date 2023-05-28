<template>
  <div data-app>
    <v-toolbar dark>
      <v-toolbar-title>{{ scene.title_slider }}</v-toolbar-title>
    </v-toolbar>

    <div class="interaction-content">
      <p>{{ scene.text_top_slider }}</p>

      <div style="display: flex">
        <p>{{ scene.border_text_left_slider }}</p>
        <v-icon
          v-if="
            evaluation.result !== undefined &&
            scene.ID == evaluation.sceneID &&
            scene.show_eval
          "
          :style="
            'position:relative; top:-30px; left:' +
            evaluation.result +
            '%; color:green'
          "
          >mdi-map-marker-check</v-icon
        >
        <v-slider
          v-model="val"
          :disabled="!active || (clicked >= 0 && !scene.reuse)"
          style="width: 200px"
          :label="scene.text_left_slider"
          min="1"
          max="100"
          thumb-label="always"
          @change="call(val)"
        >
          <template v-slot:thumb-label="{}">
            {{ scene.avg_text_slider }}
          </template>
        </v-slider>
        <p>{{ scene.border_text_right_slider }}</p>
      </div>

      <p>{{ scene.text_bot_slider }}</p>

      <div
        class="auswertung"
        v-if="
          evaluation.result !== undefined &&
          scene.ID == evaluation.sceneID &&
          scene.show_eval
        "
      >
        <p>{{ scene.avg_text_slider }} {{ evaluation.result }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    scene: Object,
    active: Boolean,

    evaluation: Object,
    clicked: Number,
  },

  name: "hz_slider",

  computed: {},

  data() {
    return {
      val: 0,
    };
  },
  mounted() {
    this.val = this.scene.startvalue;
  },

  methods: {
    call(message) {
      this.$emit("call", this.scene, message);
    },
  },
};
</script>

<style>
.interaction-content {
  padding: 3%;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
