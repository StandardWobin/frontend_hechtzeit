<template>
  <div class="background">
    <!-- BLACK -->
    <div
      class="fullscreen"
      style="background: #fff !important"
      v-if="customStageNumber == -1"
    >
      Test
    </div>

    <!-- 99 DEBUG SZENE -->
    <div v-if="customStageNumber == 99">
      <div :class="socket.connected ? 'onlinelight' : 'offlinelight'">
        <p>Socket</p>
      </div>

      <p class="whiteFont">API IX: {{ APIix }}</p>
      <p
        class="whiteFont"
        v-if="instantMessages[instantMessages.length - 1] !== undefined"
      >
        last instantMessages:
        {{ instantMessages[instantMessages.length - 1][1] }}
      </p>
      <p class="whiteFont">evalFromServer: {{ evalFromServer }}</p>
    </div>

    <!--  Audio Dunkle Macht  -->
    <div class="fullscreen" v-if="customStageNumber == 4">
      <div v-for="im in instantMessages" :key="im.key">
        <web-stage-simple-sound
          :user="im[2]"
          :data="im[3]"
          :id="im.key"
        ></web-stage-simple-sound>
      </div>
    </div>

    <!-- GEDICHT -->
    <div class="fullscreen" v-if="customStageNumber == 7">
      <div v-for="im in instantMessages" :key="im.key">
        <web-stage-simple-text
          :user="im[2]"
          :text="im[3]"
          :timer="6000"
          :id="im.key"
        ></web-stage-simple-text>
      </div>
    </div>

    <!-- Wanted Zeichnung-->
    <div class="fullscreen" v-if="customStageNumber == 8">
      <div v-for="im in instantMessages" :key="im.key">
        <web-stage-simple-image
          :user="'' + im[2]"
          :data="im[3]"
          :timer="10000"
          :id="im.key"
        ></web-stage-simple-image>
      </div>
    </div>

    <!-- Applaus -->
    <div class="fullscreen" v-if="customStageNumber == 9">
      <div v-for="im in instantMessages" :key="im.key">
        <webStageSimplePusher
          :user="'' + im[2]"
          :data="im[3]"
          :timer="1000"
          :id="im.key"
        ></webStageSimplePusher>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import webStageSimpleSound from "./modulesWebStage/simpleSound.vue";
import webStageSimpleText from "./modulesWebStage/simpleText.vue";
import webStageSimpleImage from "./modulesWebStage/simpleImage.vue";
import webStageSimplePusher from "./modulesWebStage/simplePusher.vue";

export default {
  components: {
    webStageSimpleSound,
    webStageSimpleText,
    webStageSimpleImage,
    webStageSimplePusher,
  },
  name: "webStage",
  data() {
    return {
      socket: io(process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_API),
      instantMessages: [],
      evalFromServer: [],
      link: undefined,
      APIix: -1,
      text: "",
      counter: 0,
      customStageNumber: -1,
    };
  },
  computed: {},
  destroyed() {
    this.socket.disconnect();
    this.socket = undefined;
  },
  mounted() {
    document.title = "Stage - HECHTZEIT";
    this.link = this.$route.params.link;

    this.socket.on("connect", () => {
      this.socket.emit("link", this.link);
    });

    this.socket.on("set_scene", (data) => {
      this.instantMessages = [];
      this.customStageNumber = data.customStageNumber;
    });

    this.socket.on("eval_from_server_for_api", (data) => {
      this.evalFromServer = data;
      this.customStageNumber = data.customStageNumber;
    });

    this.socket.on("call", (data) => {
      this.counter += 1;
      data.key = this.counter;
      this.instantMessages.push(data);

      if (data[2] == 1) {
        this.user = data[0];
        this.text = "drückt einen Knopf";
      }
    });
  },
  watch: {},

  methods: {
    buttonPress() {
      let data = ["Test", 1, 1, "geilo"];
      this.counter += 1;
      data.key = this.counter;
      this.instantMessages.push(data);
    },
  },
};
</script>

<style scoped>
html {
  background: #000000;
}

.whiteFont {
  color: #fff;
}
.background {
  background-color: #000000;
}

.fullscreen {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.onlinelight {
  width: 100px;
  height: 25px;
  border-radius: 5px;
  background-color: #06fc1a;
  text-align: center;
  font-weight: 500;
  margin-left: 20px;
}

.offlinelight {
  width: 100px;
  height: 25px;
  border-radius: 5px;
  background-color: #ff1900;
  text-align: center;
  font-weight: 500;
  margin-left: 20px;
}
</style>
