<!-- eslint-disable no-undef -->
<template>
  <div class="page-container">
    <!-- multitab protection -->

    <v-overlay :value="overlay" dark :absolute="true" :opacity="0.9">
      <img src="../../assets/error.png" />
      <h1>multiple tabs are forbidden, this tab is disabled</h1></v-overlay
    >
    <!-- NAVIGATION BAR -->
    <v-toolbar class="headerbar">
      <img :src="logo" style="width: auto; height: 80%" alt="Logo" />

      <span class="md-title page-title" style="margin-left: 15px; color: #fff"
        >{{ offline_name }}
      </span>
    </v-toolbar>

    <img
      v-if="title_image !== undefined"
      class="mobileheaderbanner"
      style="margin-top: -20px"
      :src="image"
    />

    <v-row no-gutters class="page-content">
      <!-- STREAM INTEGRATION -->
      <v-col
        class="stream-container"
        id="stream-container"
        cols="12"
        sm="12"
        md="6"
        lg="8"
      >
        <live-stream
          v-if="!overlay && !isMobile()"
          class="stream"
          :streamLink="streamLink"
        ></live-stream>
      </v-col>

      <!-- ///////////// SHOW/SERVER DEPENDENT ////////////// -->
      <v-col v-if="!overlay" cols="12" sm="12" md="6" lg="4">
        <v-card dark>
          <!--Object.keys(scene) == 0 here? -->
          <!-- SHOW VERBINDUNGSFEHLER -->
          <div v-if="errored" class="interaction-content">
            <img src="../../assets/error.png" />
            <h1 style="text-align: center">
              Diese Show ist leider nicht verfügar
            </h1>
          </div>

          <!-- SHOW !NOT! STARTED -->
          <div
            v-if="!socket.connected || scene === undefined"
            class="interaction-content"
          >
            <h1>{{ offline_name }}</h1>
            <span
              @click="screen = -1"
              style="margin-top: 5px; margin-left: 15px"
              >{{ offline_text }}</span
            >
          </div>

          <!-- SHOW STARTED -->
          <div v-else>
            <div v-if="scene && !acceptAgb">
              <v-toolbar dark>
                <v-toolbar-title>Willkommen</v-toolbar-title>
              </v-toolbar>
              <div style="padding: 20px">
                <p>
                  Um an den Interaktionen teilnehmen zu können, musst Du einen
                  (anonymen) Nutzernamen angeben sowie die Nutzungs- und
                  Datenschutzbedingungen akzeptieren
                </p>
                <v-text-field
                  style="color: #fff; margin: 20px"
                  v-model="username"
                  label="Dein Nutzername"
                  maxlength="20"
                  counter
                ></v-text-field>
                <v-checkbox
                  label="Ich akzeptiere die Datenschutzbestimmungen"
                ></v-checkbox>
                <v-btn style="" @click="safeUserNameAndAGB()"
                  >Zur Abstimmung</v-btn
                >
              </div>
            </div>
            <div v-if="scene !== undefined && acceptAgb">
              <!-- MODULES -->

              <p v-if="scene.disabled">Die Eingabe wurde deaktiviert</p>
              <cooldown
                class="cooldown"
                v-if="
                  scene.cooldown !== 0 &&
                  scene !== undefined &&
                  Object.keys(scene).length !== 0
                "
                :cooldown="scene.cooldown"
                :cooldownstart="cooldownstart"
                @coolDownStart="active = false"
                @coolDownEnd="
                  () => {
                    if (countdownrunning) {
                      active = true;
                    }
                    this.coolDownStart = 0;
                  }
                "
              ></cooldown>

              <countdown
                v-if="
                  scene.countdownstart !== '0' &&
                  scene !== undefined &&
                  Object.keys(scene).length !== 0
                "
                :countdown="scene.countdown"
                :countdownstart="scene.countdownstart"
                @countendEnd="
                  () => {
                    countdownrunning = false;
                    active = false;
                  }
                "
              ></countdown>

              <hz_noop v-if="scene.type == 0" :scene="scene"></hz_noop>
              <hz_mc
                v-if="scene.type == 1"
                :id="reRenderKey"
                :evaluation="evaluation"
                :scene="scene"
                :active="active && scene.disabled == 0"
                :clicked="
                  clicked[scene.ID] !== undefined ? clicked[scene.ID] : -1
                "
                @call="call"
              ></hz_mc>

              <hz_slider
                v-if="scene.type == 2"
                :scene="scene"
                :id="reRenderKey"
                :active="active && scene.disabled == 0"
                :evaluation="evaluation"
                :clicked="
                  clicked[scene.ID] !== undefined ? clicked[scene.ID] : -1
                "
                @call="call"
              ></hz_slider>
              <hz_pusher
                v-if="scene.type == 3"
                :id="reRenderKey"
                :scene="scene"
                :active="active && scene.disabled == 0"
                :evaluation="evaluation"
                @call="call"
                :clicked="
                  clicked[scene.ID] !== undefined ? clicked[scene.ID] : -1
                "
              ></hz_pusher>
              <hz_painter
                style="width: 100%; overflow: hidden"
                v-if="scene.type == 4"
                :scene="scene"
                :active="active && scene.disabled == 0"
                @call="call"
              ></hz_painter>

              <hz_voicer
                v-if="scene.type == 5"
                :id="reRenderKey"
                style="width: 100%; overflow: hidden"
                :scene="scene"
                :active="active && scene.disabled == 0"
                @call="call"
              ></hz_voicer>

              <hz_texter
                v-if="scene.type == 6"
                style="width: 100%; overflow: hidden"
                :scene="scene"
                :active="active && scene.disabled == 0"
                @call="call"
              ></hz_texter>

              <hz_imager
                v-if="scene.type == 7"
                style="width: 100%; overflow: hidden"
                :scene="scene"
                :active="active && scene.disabled == 0"
                @call="call"
              ></hz_imager>

              <qr class="qrcode" :url="url"></qr>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-footer dark class="footer2">
      <a
        href="https://blackforesttales.com/index.php/impressum/"
        target="_blank"
        >Impressum</a
      >&nbsp;&nbsp;|&nbsp;&nbsp;<a
        href="https://blackforesttales.com/index.php/datenschutz/"
        target="_blank"
        >Datenschutz</a
      >
      <a class="streamlink" :href="streamLink">Zum Video</a>
    </v-footer>
  </div>
</template>

<!-- //////////////////////////////////////////////////////////////// SCRIPT ///////////////////////////////////////////////////////-->

<script>
//
import io from "socket.io-client";
import axios from "axios";

// hechtzeit modules
import hz_noop from "./module/noop.vue";
import hz_mc from "./module/mc.vue";
import hz_slider from "./module/slider.vue";
import hz_pusher from "./module/pusher.vue";
import hz_painter from "./module/painter.vue";
import hz_voicer from "./module/voicer.vue";
import hz_texter from "./module/texter.vue";
import hz_imager from "./module/imager.vue";

import liveStream from "./livestream.vue";
import qr from "./qr.vue";
import countdown from "./countdown.vue";
import cooldown from "./cooldown.vue";

export default {
  components: {
    hz_noop, //  0
    hz_mc, //  1
    hz_slider, //  2
    hz_pusher, //  3
    hz_painter, //  4
    hz_voicer, //  5
    hz_texter, //  6
    hz_imager, //  7
    liveStream,
    qr,
    countdown,
    cooldown,
  },
  name: "liveAudience",
  computed: {},
  data() {
    return {
      link: 0,
      socket: io(
        process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_BACKEND + "/user",
        {
          auth: { Authorization: window.location.pathname.split("/").at(-1) },
        }
      ),
      reRenderKey: 0,
      offline_text: "",
      offline_name: "",
      countdownrunning: false,
      title_image: undefined,
      scene: undefined,
      errored: false,
      debug: 0,
      image: undefined,
      logo: undefined,
      updates: 0,
      username: "",
      acceptAgb: false,
      streamLink: "",
      url: "",
      clicked: {},
      overlay: false,
      active: true,
      cooldownstart: 0,
      evaluation: { sceneID: -1, result: -1, type: -1 },
    };
  },

  destroyed() {
    this.socket.disconnect();
    this.socket = undefined;
  },
  mounted() {
    // procedure which run after site loaded
    this.link = this.$route.params.link;
    this.url = window.location.href;
    document.title = "HECHTZEIT";

    const channel = new BroadcastChannel("tab");

    // channel.postMessage("another-tab", window.location.href);

    channel.addEventListener("message", (msg) => {
      if (msg.data === "another-tab") {
        // message received from 2nd tab

        if (window.frameElement === null) {
          this.overlay = true;
          this.socket.disconnect();
        } else {
          if (!window.frameElement.baseURI.includes("show?Link=")) {
            this.overlay = true;
            this.socket.disconnect();
          }
        }
      }
    });

    // eslint-disable-next-line no-undef
    let username = $cookies.get("username");
    let acceptAgb =
      // eslint-disable-next-line no-undef
      $cookies.get("acceptAgb") === "true" ||
      // eslint-disable-next-line no-undef
      $cookies.get("acceptAgb") === true;

    if (username !== undefined && username !== null && acceptAgb == true) {
      this.username = username;
      this.acceptAgb = acceptAgb;
    }

    // request the show information
    this.get_show();

    this.socket.on("whoami", (data) => {
      // eslint-disable-next-line no-undef
      let keks = $cookies.get("whoami");

      if (keks == null || keks === undefined) {
        // eslint-disable-next-line no-undef
        $cookies.set("whoami", data, null, null, null, true, "Strict");
      }
    });

    // enable triggers from socket message from server
    this.socket.on("scene", (data) => {
      this.errored = false;
      this.updates = this.updates + 1;
      // scene information send by server
      this.scene = JSON.parse(JSON.stringify(data));
      if (
        this.scene.countdownstart == 0 ||
        this.scene.countdown * 1000 + this.scene.countdownstart < Date.now()
      ) {
        if (
          this.scene.countdown * 1000 + this.scene.countdownstart <
          Date.now()
        ) {
          this.countdownrunning = true;
        }
        this.active = true;
      }
    });

    this.socket.on("eval_from_server_for_user", (data) => {
      this.evaluation = data;
    });

    this.socket.on("disconnect", () => {
      this.get_show();
      setTimeout(() => {
        this.socket.connect();
        this.get_show();
      }, 5000);
    });
  },

  methods: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },

    safeUserNameAndAGB() {
      this.acceptAgb = true;
      // eslint-disable-next-line no-undef
      $cookies.set("username", this.username, null, null, null, true, "Strict");
      // eslint-disable-next-line no-undef
      $cookies.set(
        "acceptAgb",
        this.acceptAgb,
        null,
        null,
        null,
        true,
        "Strict"
      );
    },

    // stupid ass vue list rendering...
    forceRerender() {
      this.reRenderKey = this.reRenderKey + 1;
    },

    call(scene, message) {
      this.clicked[scene.ID] = message;
      this.forceRerender();
      this.cooldownstart = Date.now();
      if (scene === undefined) {
        // stop message cause data is corrupt
        return;
      }

      if (this.scene === undefined) {
        // stop message cause data is corrupt
        return;
      }

      if (this.scene.ID === undefined || this.scene.type === undefined) {
        // stop message cause data is corrupt
        return;
      }

      if (message === undefined) {
        // stop message cause data is corrupt
        return;
      }

      if (
        this.scene.sceneID != scene.sceneID ||
        this.scene.type != this.scene.type
      ) {
        // stop message cause date already chagned criticaly
        return;
      }

      if (
        this.username === undefined ||
        this.username === "" ||
        this.username === null ||
        this.username.length == 0
      ) {
        // stop message cause no username has been defined
        return;
      }
      // send a message to the server via the socket
      this.socket.emit("call", {
        username: this.username,
        scene: scene,
        message: message,
        // eslint-disable-next-line no-undef
        token: $cookies.get("whoami"),
      });
    },

    get_show() {
      // get the show information
      axios
        .get(
          process.env.VUE_APP_HOST +
            ":" +
            process.env.VUE_APP_BACKEND +
            "/api/showUser",
          { headers: { show: this.link } }
        )
        .then((response) => {
          this.errored = false;

          this.offline_text = response.data.offline_text;
          this.offline_name = response.data.offline_name;
          this.title_image = response.data.title_image;
          this.streamLink = response.data.stream_link;
          this.image = response.data.image;
          this.logo = response.data.logo;

          document.title = this.offline_name + " - HECHTZEIT";
        })
        .catch(() => {
          this.errored = true;
          // if resp is unauthorized, logout, to
        });
    },
  },
};
</script>

<!-- //////////////////////////////////////////////////////////////// STYLE ///////////////////////////////////////////////////////-->

<style lang="scss" scoped>
.footer2 {
  display: absolute !important;
  position: fixed;
  width: 100%;
  bottom: 0;
  color: white;
}

.footer2 a {
  text-decoration: none;
  color: #ccc;
}

.qrcode {
}

.streamlink {
  display: none;
}

body {
  overflow: hidden;
  width: 100vw;
  background: #1a1a1a;
}

.page-container {
  background: #1a1a1a;
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.page-content {
  background: #1a1a1a;
  overflow: hidden;
}

.headerbar {
  background: #030303 !important;
  width: 100vw;
  margin: 0;
  display: flex;
}

.mobileheaderbanner {
  display: none;
}

.stream-container {
  display: inline;
}

.answer {
  background: #aaa !important;
  color: #000000 !important;
  border-radius: 4px !important;
  margin-bottom: 15px;
  margin-top: 20px;
}

.cooldown {
  z-index: 10;
  position: absolute;
  right: 0px;
  top: -20px;
  transform: scale(0.5);
}

@media screen and (max-width: 599px) {
  .streamlink {
    display: inline;
    text-align: right;
    margin-left: 10%;
  }
  .stream-container {
    display: none;
  }

  .qrcode {
    display: none;
  }

  .mobileheaderbanner {
    display: inline;
    height: 10vh;
    width: 100%;
  }

  .page-content {
    background: #1a1a1a;
    padding: 0px;
    overflow: hidden;
  }

  .cooldown {
    top: -25px;
  }
}
</style>
