<template>
  <div class="wanted-plakat">
    <Transition>
      <img
        class="image"
        :id="id"
        @load="manualMount()"
        v-if="show"
        :src="data"
      />
    </Transition>
  </div>
</template>

<script>
export default {
  name: "webStageSimpleImage",

  props: {
    user: String,
    data: ArrayBuffer,
    timer: Number,
    id: Number,
    bgImage: String,
  },

  data() {
    return {
      show: true,
      x: 0,
      y: 0,
    };
  },
  methods: {
    manualMount() {
      this.x = 35;
      this.y = 13;

      var el = document.getElementById(this.id);
      el.style.setProperty("color", "#fff");
      el.style.setProperty(
        "transform",
        "translate(" + this.x + "%, " + this.y + "%)"
      );

      setTimeout(() => {
        this.show = false;
      }, this.timer);
    },
  },

  mounted() {},
};
</script>

<style>
.image {
  width: 800px;
  max-width: 800px;
  height: 800px;
  position: fixed;
  left: 0vw;
  top: 0vh;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.wanted-plakat {
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
