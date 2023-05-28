<template>
  <div data-app>
    <v-toolbar dark>
      <v-toolbar-title>{{ scene.title_pusher }}</v-toolbar-title>
    </v-toolbar>
    <div class="interaction-content" v-if="scene.size_pusher <= 3">
      <v-icon
        v-if="scene.size_pusher == 1"
        :disabled="!active"
        class="pusher single-pusher"
        size="300"
        @click="call(1)"
        >mdi-{{ scene.icon_1_pusher }}</v-icon
      >

      <v-icon
        v-if="scene.size_pusher > 1"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
        class="pusher multiple-pusher"
        size="150"
        @click="call(1)"
        >mdi-{{ scene.icon_1_pusher }}</v-icon
      >

      <v-icon
        v-if="scene.size_pusher > 1"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
        class="pusher multiple-pusher"
        size="150"
        @click="call(2)"
        >mdi-{{ scene.icon_2_pusher }}
      </v-icon>

      <v-icon
        v-if="scene.size_pusher > 2"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
        class="pusher multiple-pusher"
        size="150"
        @click="call(3)"
        >mdi-{{ scene.icon_3_pusher }}
      </v-icon>

      <v-icon
        v-if="scene.size_pusher > 3"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
        class="pusher multiple-pusher"
        size="150"
        @click="call(4)"
        >mdi-{{ scene.icon_4_pusher }}
      </v-icon>
      <p>{{ scene.text_pusher }}</p>
      <p><br /><br /><br /></p>
    </div>

    <v-container class="interaction-content" v-if="scene.size_pusher > 3">
      <v-row no-gutters>
        <v-col cols="4" class="arrow-grid"><v-spacer></v-spacer></v-col>
        <v-col cols="4" class="arrow-grid">
          <v-icon
            :disabled="!active || (clicked >= 0 && !scene.reuse)"
            class="pusher multiple-pusher-4"
            size="50"
            @click="call(1)"
            >mdi-{{ scene.icon_1_pusher }}</v-icon
          >
        </v-col>
        <v-col cols="4" class="arrow-grid"><v-spacer></v-spacer></v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="4" class="arrow-grid">
          <v-icon
            :disabled="!active || (clicked >= 0 && !scene.reuse)"
            class="pusher multiple-pusher-4"
            size="50"
            @click="call(2)"
            >mdi-{{ scene.icon_2_pusher }}
          </v-icon>
        </v-col>
        <v-col cols="4" class="arrow-grid"
          ><v-icon class="pusher multiple-pusher-4" disabled size="50"
            >mdi-arrow-all</v-icon
          ></v-col
        >
        <v-col cols="4" class="arrow-grid">
          <v-icon
            :disabled="!active || (clicked >= 0 && !scene.reuse)"
            class="pusher multiple-pusher-4"
            size="50"
            @click="call(3)"
            >mdi-{{ scene.icon_3_pusher }}
          </v-icon>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="4" class="arrow-grid"><v-spacer></v-spacer></v-col>
        <v-col cols="4" class="arrow-grid">
          <v-icon
            :disabled="!active || (clicked >= 0 && !scene.reuse)"
            class="pusher multiple-pusher-4"
            size="50"
            @click="call(4)"
            >mdi-{{ scene.icon_4_pusher }}
          </v-icon>
        </v-col>
        <v-col cols="4" class="arrow-grid"><v-spacer></v-spacer></v-col>
      </v-row>

      <p><br /><br /><br /></p>
      <p>{{ scene.text_pusher }}</p>
      <p><br /><br /><br /></p>
    </v-container>

    <div
      class="auswertung"
      v-if="
        evaluation.result !== undefined &&
        scene.ID == evaluation.sceneID &&
        scene.show_eval
      "
    >
      <p v-if="scene.size_pusher >= 1">
        <v-icon>mdi-{{ scene.icon_1_pusher }}</v-icon> wurde
        {{ evaluation.result[0] }} mal gedrückt
      </p>
      <p v-if="scene.size_pusher > 1">
        <v-icon>mdi-{{ scene.icon_2_pusher }}</v-icon> wurde
        {{ evaluation.result[1] }} mal gedrückt
      </p>
      <p v-if="scene.size_pusher > 2">
        <v-icon>mdi-{{ scene.icon_3_pusher }}</v-icon> wurde
        {{ evaluation.result[2] }} mal gedrückt
      </p>
      <p v-if="scene.size_pusher > 3">
        <v-icon>mdi-{{ scene.icon_4_pusher }}</v-icon> wurde
        {{ evaluation.result[3] }} mal gedrückt
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "hz_pusher",
  components: {},
  props: {
    scene: Object,
    active: Boolean,
    evaluation: Object,
    clicked: Number,
  },
  data() {
    return {
      val: 0,
      debug: false,
    };
  },
  mounted() {},
  computed: {},
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

.pusher:active {
  background: #494949;
  background-size: 120%;
  border-radius: 150px;
}

.single-pusher {
  margin-top: 50px;
  width: 300px;
  height: 300px;
}

.multiple-pusher {
  margin: 20px 50px 50px 50px;
}

.multiple-pusher-4 {
  margin: 10px;
}

.arrow-grid {
  width: 70px !important;
}

@media screen and (max-width: 599px) {
  .multiple-pusher {
    margin: 10px 10px 10px 10px;
  }
}
</style>
