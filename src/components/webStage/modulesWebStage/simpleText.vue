<template id="#mount">
  <div>
    <Transition>
      <p :id="id" v-if="show">{{ user }} - {{ text }}</p>
    </Transition>
  </div>
</template>

<script>
export default {
  name: "webStageSimpleText",

  props: {
    user: String,
    text: String,
    timer: Number,
    id: Number,
  },

  data() {
    return {
      show: true,
      x: 0,
      y: 0,
    };
  },

  mounted() {
    this.x = Math.ceil(Math.random() * 80);
    this.y = Math.ceil(Math.random() * 500);
    let el = document.getElementById(this.id);
    el.style.setProperty("color", "#fff");
    el.style.setProperty(
      "transform",
      "translate(" + this.x + "%, " + this.y + "%)"
    );

    setTimeout(() => {
      this.show = false;
    }, this.timer);
  },

  methods: {},
};
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
