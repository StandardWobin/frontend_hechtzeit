<template>
  <div>
    <v-toolbar dark>
      <v-toolbar-title>{{ scene.title_noop }}</v-toolbar-title>
    </v-toolbar>

    <div class="interaction-content">
      <v-icon size="150" class="noop-icon">mdi-{{ scene.icon_noop }}</v-icon>
      <h3 class="noop-text">{{ scene.text_noop }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    scene: Object,
  },

  name: "hz_noop",

  computed: {},

  data() {
    return {};
  },
  mounted() {},

  methods: {},
};
</script>

<style>
.interaction-content {
  padding: 5%;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
  text-align: center;
}

.noop-icon {
  width: 100%;
  margin-bottom: 30px;
  padding-top: 10%;
}

.noop-text {
  padding-bottom: 15%;
}
</style>
