<template>
  <div style="width: 100%">
    <h1></h1>

    <v-toolbar class="client-preview-header">
      <div style="display: flex">
        <div :class="socket.connected ? 'onlinelight' : 'offlinelight'">
          <p>API</p>
        </div>
      </div>

      <v-icon @click="messages = [{ content: 'resetted', color: 'white' }]"
        >mdi-delete</v-icon
      >

      <v-checkbox
        :label="'Eval'"
        color="orange"
        v-model="showAutoEval"
        small
      ></v-checkbox>
      <v-checkbox
        :label="'Push'"
        color="red"
        v-model="showInstands"
        small
      ></v-checkbox>
    </v-toolbar>

    <div style="width: 100%; height: 100%; background-color: #426c78">
      <p v-if="!socket.connected">Socket zum API backend nicht connected</p>
      <div
        style="height: 40vh; overflow: auto; padding-bottom: 40px"
        id="previewConsoleId"
      >
        <div v-for="m in messages" :key="m.ids">
          <p :style="'background:' + m.color">{{ m.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "theApiPreview",
  components: {},
  props: {
    link: String,
  },

  computed: {},

  data() {
    return {
      socket: io(process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_API),
      messages: [],
      keycounter: 0,
      showAutoEval: true,
      showInstands: true,
    };
  },
  destroyed() {
    this.socket.disconnect();
    this.socket = undefined;
  },
  mounted() {
    // procedure which run after site loaded

    this.socket.on("connect", () => {
      let link = new URL(location.href).searchParams.get("Link");

      this.socket.emit("link", link);
      this.addText("Verbunden zur API", "white");
    });

    this.socket.on("set_scene", (data) => {
      this.addText("Set scene: " + data, "orange");
    });

    this.socket.on("eval_from_server_for_api", (data) => {
      if (!this.showAutoEval) {
        return;
      }
      // eslint-disable-next-line valid-typeof
      if (typeof data.result === "Array") {
        this.addText(
          "StageNumber:" + data.customStageNumber + " - " + data.result.join(),
          "orange"
        );
      } else {
        this.addText(
          "StageNumber:" + data.customStageNumber + " - " + data.result,
          "orange"
        );
      }
    });

    this.socket.on("call", (data) => {
      if (!this.showInstands) {
        return;
      }
      if (data[0] == 1) {
        this.addText(
          "Instand - Scene: " +
            data[1] +
            " User:" +
            data[2] +
            " drückt Button " +
            data[3],
          "red"
        );
      } else if (data[0] == 2) {
        this.addText(
          "Instand - Scene: " +
            data[1] +
            " User:" +
            data[2] +
            " schiebt Regler auf " +
            data[3],
          "red"
        );
      } else if (data[0] == 3) {
        this.addText(
          "Instand - Scene: " +
            data[1] +
            " User:" +
            data[2] +
            " pusht Knopf " +
            data[3],
          "red"
        );
      } else if (data[0] == 4) {
        this.addText(
          "Instand - Scene: " + data[1] + " User:" + data[2] + " drew somethin",
          "red"
        );
      } else if (data[0] == 5) {
        this.addText(
          "Instand - Scene: " +
            data[1] +
            " User:" +
            data[2] +
            " send voice message",
          "red"
        );
      } else if (data[0] == 6) {
        this.addText(
          "Instand - Scene: " +
            data[1] +
            " User:" +
            data[2] +
            " send text message",
          "red"
        );
      } else if (data[0] == 7) {
        this.addText(
          "Instand - Scene: " + data[1] + " User:" + data[2] + " send image",
          "red"
        );
      }
    });
  },

  methods: {
    currentTime() {
      // https://shouts.dev/articles/get-current-date-and-time-in-vuejs
      const current = new Date();

      let hours = current.getHours();
      let minutes = current.getMinutes();
      let seconds = current.getSeconds();

      hours.toString().length == 1 ? (hours = "0" + hours) : () => {};
      minutes.toString().length == 1 ? (minutes = "0" + minutes) : () => {};
      seconds.toString().length == 1 ? (seconds = "0" + seconds) : () => {};

      const time = hours + ":" + minutes + ":" + seconds;

      return time;
    },

    addText(appendix, color) {
      if (color === undefined) {
        throw new Error("forbidden");
      }
      let newtext = this.currentTime() + " - " + appendix + "\n";
      this.messages.push({ content: newtext, color: color });
      var elem = document.getElementById("previewConsoleId");
      elem.scrollTop = elem.scrollHeight + 100000000000000;
    },
  },
};
</script>

<style>
.onlinelight {
  width: 90px;
  height: 25px;
  border-radius: 5px;
  background-color: #06fc1a;
  text-align: center;
  font-weight: 500;
  margin-left: 10px;
}

.offlinelight {
  width: 90px;
  height: 25px;
  border-radius: 5px;
  background-color: #ff1900;
  text-align: center;
  font-weight: 500;
  margin-left: 10px;
}
</style>
