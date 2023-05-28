<template>
  <!-- mainly stolen from https://stackoverflow.com/questions/70926116/vue-konva-how-start-drawing-->
  <div>
    <v-toolbar dark>
      <v-toolbar-title>{{ scene.title_painter }}</v-toolbar-title>
    </v-toolbar>

    <div class="interaction-content">
      <p>{{ scene.text_painter }}</p>

      <div id="color-picker-div">
        <div
          id="stroke-width-visualizer"
          :style="{
            width: strokeWidth + 'px',
            height: strokeWidth + 'px',
            backgroundColor: color,
          }"
        ></div>
        <v-icon
          @click="clear()"
          :disabled="this.lines.length == 0"
          class="delete-icon"
          size="35"
          >mdi-delete</v-icon
        >
        <v-color-picker
          class="v-color-picker"
          v-model="color"
          dark
          :swatches="swatches"
          show-swatches
          value="#000"
          hide-canvas
          hide-inputs
          hide-mode-switch
          hide-sliders
          mode="hexa"
          swatches-max-height="100"
        >
        </v-color-picker>
        <input
          class="stroke-width-slider"
          type="range"
          min="1"
          max="40"
          v-model="strokeWidth"
        />
      </div>

      <br />
      <v-stage
        style="
          cursor: crosshair;
          height: 400px !important;
          width: 400px !important;
        "
        ref="stage"
        :config="configKonva"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @touchstart="handleMouseDown"
        @touchmove="handleMouseMove"
        @touchend="handleMouseUp"
      >
        <v-layer ref="layer">
          <v-line
            v-for="line in lines"
            :key="line.id"
            :config="{
              strokeWidth: line.strokeWidth,
              stroke: line.color,
              points: line.points,
            }"
          />
        </v-layer>
      </v-stage>
      <br />
      <v-btn
        @click="
          render();
          clear();
        "
        :disabled="this.lines.length == 0 || !active"
        >{{ scene.button_text_painter }}&nbsp;&nbsp;<v-icon
          >mdi-send</v-icon
        ></v-btn
      >
      <br />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scene: Object,
    active: Boolean,
  },

  name: "hz_painter",

  data() {
    return {
      src: undefined,
      stage: undefined,
      layer: undefined,
      rect: undefined,
      color: "#000000",
      strokeWidth: 13,
      lines: [],
      image: undefined,
      isDrawing: false,
      configKonva: {
        width: 400,
        height: 400,
      },
      swatches: [
        ["#000000", "#505050", "#ffffff"],
        ["#740b07", "#ef130b", "#e8a200"],
        ["#ffe400", "#00cc00", "#004619"],
        ["#00ff91", "#00b2ff", "#231fd3"],
        ["#a300ba", "#df69a7", "#a0522d"],
      ],
    };
  },
  mounted() {
    this.stage = this.$refs.stage.getNode();
    this.layer = this.$refs.layer.getNode();
    this.stage.getContainer().style.backgroundColor = "white";
  },
  methods: {
    clear() {
      this.lines = [];
    },

    async render() {
      this.src = this.stage.toDataURL();
      this.call(this.src);
    },
    call(message) {
      this.$emit("call", this.scene, message);
    },

    handleMouseDown(e) {
      this.isDrawing = true;
      const pos = e.target.getStage().getPointerPosition();
      this.lines = [
        ...this.lines,
        { points: [pos.x, pos.y], color: this.color },
      ];
    },
    handleMouseMove(e) {
      // no drawing - skipping
      if (!this.isDrawing) {
        return;
      }
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      let lastLine = this.lines[this.lines.length - 1];
      // add point
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      lastLine.color = this.color;
      lastLine.strokeWidth = this.strokeWidth;
      // replace last
      this.lines.splice(this.lines.length - 1, 1, lastLine);
    },

    handleMouseUp() {
      this.isDrawing = false;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#color-picker-div {
  width: 100%;
  height: auto;
  margin-top: -20px;
  margin-bottom: -15px;
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.v-color-picker {
  align-self: center;
}

.delete-icon {
  position: absolute;
  top: 60px;
  left: 80%;
  width: 35px;
}

.stroke-width-slider {
  width: 300px;
  align-self: center;
  margin-bottom: 14px !important;
}

#stroke-width-visualizer {
  align-self: center;
  border-radius: 100px;
  position: absolute;
  top: 215px;
  left: 475px;
  vertical-align: baseline;
  transform: translate(-50%, -50%);
}
</style>
