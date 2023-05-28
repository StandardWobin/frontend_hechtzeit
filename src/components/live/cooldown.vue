<template>
  <div v-if="cooldownstart !== 0">
    <v-progress-circular
      :rotate="360"
      :size="100"
      :height="15"
      :width="10"
      :value="95 - timer"
      :color="timer > 75 && cooldown > 5 && timer % 2 == 0 ? '#f00' : '#fff'"
    >
      <strong>{{ text }}</strong>
    </v-progress-circular>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    cooldown: Number,
    cooldownstart: Number,
  },

  name: "coolDown",

  computed: {},

  data() {
    return {
      timer: 0,
      interval: undefined,
      text: "",
    };
  },
  mounted() {},

  watch: {
    cooldownstart() {
      this.$emit("coolDownStart");
      this.interval = setInterval(this.updateTimer, 18);
    },
  },

  methods: {
    updateTimer() {
      if (Date.now() > this.cooldownstart + this.cooldown * 1000) {
        this.text = "";
        clearInterval(this.interval); // thanks @Luca D'Amico
        this.$emit("coolDownEnd");
        return;
      } else {
        let delta = Math.max(0, (Date.now() - this.cooldownstart) / 1000);
        this.timer = Math.ceil((delta / this.cooldown) * 100);

        let str = (this.cooldown - delta).toString(10).split(".");
        let dec = "";
        if (str[1] !== undefined) {
          dec = str[1].length > 0 ? str[1][0] : "";
        }

        this.text = str[0] + "." + dec + " Sek";
      }
    },
  },
};
</script>

<style></style>
