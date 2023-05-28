<template v-app>
  <v-card outlined elevation="3" style="width: 100%">
    <v-card-title
      >{{ question }}
      <h1>{{ id }}</h1>
      <v-progress-circular
        v-if="this.autoNumber > 0"
        :rotate="360"
        :size="100"
        :height="5"
        :width="5"
        :value="100 - timer"
      >
        <strong>{{ text }}</strong>
      </v-progress-circular>
    </v-card-title>
    <v-card-text>
      <v-divider></v-divider>

      <v-card-subtitle>{{ username }}:</v-card-subtitle>

      <h1 v-if="type <= 3">{{ content.content }}</h1>
      <h1 v-if="type >= 6">{{ content.content }}</h1>

      <feedback-painter
        v-if="type == 4"
        :data="content.content"
      ></feedback-painter>
      <feedback-voicer
        v-if="type == 5"
        :data="content.content"
      ></feedback-voicer>

      <v-divider></v-divider>

      <v-card-actions>
        <v-text-field
          class="uglyclassname"
          v-model="noteIntern"
          placeholder="Notiz"
          @input="$emit('changeNote', id, noteIntern)"
        ></v-text-field>

        <v-btn @click="accept()" color="#cbe3c3" v-if="acceptOK"
          ><v-icon>mdi-check</v-icon></v-btn
        >
        <v-btn @click="acceptAndSend()" v-if="sendOK" color="#21ff00"
          >Stage&nbsp;<v-icon>mdi-send</v-icon></v-btn
        >

        <v-btn @click="decline()" color="#eb949d" v-if="declineOK"
          ><v-icon>mdi-cancel</v-icon></v-btn
        >

        <v-btn @click="declineMID()" color="#eb949d" v-if="declineMIDOK"
          ><v-icon>mdi-cancel</v-icon></v-btn
        >

        <v-btn @click="deleteit()" color="#eb949d" v-if="deleteOK"
          ><v-icon>mdi-delete</v-icon></v-btn
        >
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>
<script>
import feedbackVoicer from "./modulesfeedback/voicer.vue";
import feedbackPainter from "./modulesfeedback/painter.vue";

export default {
  name: "feedbackMessage",
  props: {
    feedback: Object,
    autoNumber: Number,
    acceptOK: Boolean,
    sendOK: Boolean,
    declineOK: Boolean,
    declineMIDOK: Boolean,

    deleteOK: Boolean,
  },
  components: {
    feedbackVoicer,
    feedbackPainter,
  },
  data() {
    return {
      interval: undefined,
      timer: 0,
      text: "",
      delta: 0,
      noteIntern: "",
      question: undefined,
      username: undefined,
      type: undefined,
      content: undefined,
      id: undefined,
    };
  },

  created() {},
  computed: {
    startTime() {
      return Date.now();
    },
  },

  mounted() {
    this.question = this.feedback.question;
    this.username = this.feedback.username;
    this.type = this.feedback.type;
    this.content = this.feedback.content;
    this.id = this.feedback.id;

    if (this.autoNumber > 0) {
      this.interval = setInterval(this.updateTimer, 18);
    }
    this.noteIntern = this.feedback.node;
  },

  watch: {
    feedback() {
      this.noteIntern = this.feedback.node;
    },
  },

  methods: {
    updateTimer() {
      if (Date.now() > this.startTime + this.autoNumber * 1000) {
        this.$emit("coolDownEnd", this.id);
        clearInterval(this.interval); // thanks @Luca D'Amico
      } else {
        this.delta = Math.max(0, (Date.now() - this.startTime) / 1000);
        this.timer = Math.ceil((this.delta / this.autoNumber) * 100);

        let str = (this.autoNumber - this.delta).toString(10).split(".");
        let dec = "";
        if (str[1] !== undefined) {
          dec = str[1].length > 0 ? str[1][0] : "";
        }

        this.text = str[0] + "." + dec + " Sek";
      }
    },

    deleteit() {
      this.$emit("deleteit", this.id);
    },
    accept() {
      this.$emit("accept", this.id);
    },

    acceptAndSend() {
      this.$emit("acceptAndSend", this.id);
    },

    decline() {
      this.$emit("decline", this.id);
    },

    declineMID() {
      this.$emit("declineMID", this.id);
    },
  },
};
</script>

<style scoped>
.uglyclassname {
  width: 30px;
}
</style>
