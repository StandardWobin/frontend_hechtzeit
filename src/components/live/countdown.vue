<template>
  <div>
    <v-progress-linear v-model="timer" color="blue-grey" height="25">
      <template v-slot:default="{}">
        <strong>{{ text }}</strong>
      </template>
    </v-progress-linear>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    countdown: Number,
    countdownstart: String,
  },

  name: "countDown",

  computed: {},

  data() {
    return {
      timer: 0,
      interval: undefined,
      text: "",
    };
  },
  mounted() {
    this.interval = setInterval(this.updateTimer, 18);
  },

  methods: {
    updateTimer() {
      let cds = parseInt(this.countdownstart);
      if (Date.now() > cds + this.countdown * 1000) {
        this.text = "Zeit abgelaufen";
        clearInterval(this.interval); // thanks @Luca D'Amico
        this.$emit("countendEnd");
        return;
      } else {
        let delta = Math.max(0, (Date.now() - cds) / 1000);
        this.timer = (delta / this.countdown) * 100;
        let str = (this.countdown - delta).toString(10).split(".");
        let dec = "";
        if (str[1] !== undefined) {
          dec = str[1].length > 0 ? str[1][0] : "";
        }

        this.text = "Countdown " + str[0] + "." + dec + " Sekunden";
      }
    },
  },
};
</script>

<style></style>
