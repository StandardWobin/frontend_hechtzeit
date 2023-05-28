<template data-app>
  <v-app class="container" id="app">
    <v-toolbar max-height="70px" class="moderation-header">
      <router-link to="/showlist"><v-icon>mdi-arrow-left</v-icon></router-link>
      <h2>&nbsp;Moderation</h2>
      <div
        v-if="socket !== undefined"
        :class="socket.connected ? 'onlinelight' : 'offlinelight'"
      >
        <p>ADMIN</p>
      </div>
      <h1>API index:{{ apiScene }}</h1>
      <!--
      <v-switch
        style="height: 70px; margin-left: 20px; margin-top: 40px"
        label="Alles akzeptieren"
        color="green"
        v-model="autoaccept"
      ></v-switch>
      <v-switch
        style="height: 70px; margin-left: 20px; margin-top: 40px"
        label="Alles ablehnen"
        color="red"
        v-model="autodecline"
      ></v-switch>
      <v-switch
        style="height: 70px; margin-left: 20px; margin-top: 40px"
        label="Autmatisch akzeptieren nach"
        color="orange"
        v-model="useslider"
      ></v-switch>

      <v-slider
        v-model="autoNumber"
        :disabled="!useslider"
        color="orange"
        min="0"
        max="30"
        thumb-label="always"
        :thumb-size="24"
        style="height:70px;max-width:100px;margin-top:50px;"
      >
        <template v-slot:thumb-label="{ value }"> {{ value }} s </template>
      </v-slider>
      -->
    </v-toolbar>

    <div class="page-content">
      <v-col cols="12" sm="12" md="4" lg="4">
        <v-toolbar style="display: flex; justify-content: space-between">
          <h3>Warteschlange: {{ incoming.length }}</h3>
          &nbsp;&nbsp;&nbsp;
          <v-btn
            :disabled="incoming.length < 1"
            @click="acceptAll()"
            color="#cbe3c3"
            ><v-icon>mdi-check-all</v-icon></v-btn
          >
          <v-btn
            :disabled="incoming.length < 1"
            color="#eb949d"
            @click="declineAll()"
            >Alle Ablehnen<v-icon>mdi-delete</v-icon></v-btn
          >
        </v-toolbar>

        <draggable
          v-model="incoming"
          group="fb"
          @change="changeIncoming"
          class="feedback-list"
        >
          <div
            v-for="(feedback, index) in incoming"
            :key="feedback.ID"
            class="feedback-item-container"
          >
            <feedback-message
              class="feedback-item"
              :key="reRenderKey"
              :feedback="feedback"
              :autoNumber="useslider ? autoNumber : 0"
              :node="feedback.note"
              :acceptOK="true"
              :declineOK="true"
              :sendOK="false"
              @accept="accept"
              @decline="decline"
              @coolDownEnd="coolDownEnd"
              @changeNote="
                (ix, newNoteContent) => {
                  changeNoteIN(index, newNoteContent);
                }
              "
            ></feedback-message>
          </div>
        </draggable>
      </v-col>

      <v-col cols="12" sm="12" md="4" lg="4">
        <v-toolbar style="background: #cbe3c3">
          <h3>Angenommen</h3>
          <v-btn
            :disabled="accepted.length < 1"
            color="#21ff00"
            @click="randomSend()"
            >1 RANDOM SENDEN<v-icon>mdi-send</v-icon></v-btn
          >

          <!--<v-switch  style="height: 70px; margin-left: 20px; margin-top: 45px" v-model="autosend" label="autosenden"></v-switch>-->
        </v-toolbar>

        <draggable v-model="accepted" group="fb" class="feedback-list">
          <div
            v-for="(feedback, index) in accepted"
            :key="feedback.ID"
            class="feedback-item-container"
          >
            <feedback-message
              :key="reRenderKey"
              :feedback="feedback"
              :autoNumber="useslider ? autoNumber : 0"
              :node="feedback.note"
              :declineOK="false"
              :declineMIDOK="true"
              @declineMID="declineMID"
              :sendOK="true"
              @acceptAndSend="send"
              @decline="decline"
              @coolDownEnd="coolDownEnd"
              @changeNote="
                (ix, newNoteContent) => {
                  changeNoteAC(index, newNoteContent);
                }
              "
            ></feedback-message>
          </div>
        </draggable>
      </v-col>

      <v-col cols="12" sm="12" md="4" lg="4">
        <v-toolbar style="background: #eb949d">
          <h3>Abgelehnt</h3>
        </v-toolbar>

        <draggable v-model="declined" group="fb" class="feedback-list">
          <div
            v-for="(feedback, index) in declined"
            :key="feedback.ID"
            class="feedback-item-container"
          >
            <feedback-message
              :key="reRenderKey"
              :feedback="feedback"
              :autoNumber="useslider ? autoNumber : 0"
              :deleteOK="true"
              @deleteit="deleteit"
              @coolDownEnd="coolDownEnd"
              @changeNote="
                (ix, newNoteContent) => {
                  changeNoteDE(index, newNoteContent);
                }
              "
            ></feedback-message>
          </div>
        </draggable>
      </v-col>
    </div>
  </v-app>
</template>

<style></style>

<script>
import feedbackMessage from "./feedbackMessage.vue";
import io from "socket.io-client";
import draggable from "vuedraggable";

export default {
  components: { feedbackMessage, draggable },
  name: "theModeration",
  testCounter: 5,
  data() {
    return {
      incoming: [],
      accepted: [],
      declined: [],
      reRenderKey: 0,

      apiScene: -1,
      autoaccept: false,
      autodecline: false,
      socket: undefined,
      link: "",
      autoNumber: 20,
      feedbacks: [],
      counter: 0,
      useslider: false,
      autosend: false,
    };
  },
  computed: {},

  mounted() {
    document.title = "Moderation - HECHTZEIT";
    // eslint-disable-next-line no-undef
    var token = $cookies.get("authenticatekey") || "";

    this.link = new URL(location.href).searchParams.get("Link");

    let url =
      process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_BACKEND + "/admin";
    let auth = "Bearer " + token + "$$$" + this.link;

    this.socket = io(url, {
      auth: { Authorization: auth },
    });

    this.socket.on("goupdate_scene_stageInShow", (message) => {
      this.apiScene = message.apiIx;
    });

    this.socket.on("admin_moderate_this", (message) => {
      if (this.autoaccept) {
        // this.socket.emit("admin_accept_scene", message.scene);
      } else if (this.autodecline) {
        () => {};
      } else {
        let feedback = message;
        feedback.username = message.username;

        feedback.type = message.scene.type;
        feedback.node = "";

        feedback.id = this.counter;
        this.counter = this.counter += 1;

        if (message.scene.type == 0) {
          feedback.question = message.scene.title_noop;
          feedback.content = { content: message.message.toString() };
        }
        if (message.scene.type == 1) {
          feedback.question = message.scene.title_mc;
          feedback.content = { content: message.message.toString() };
        }
        if (message.scene.type == 2) {
          feedback.question = message.scene.title_slider;
          feedback.content = { content: message.message.toString() };
        }
        if (message.scene.type == 3) {
          feedback.question = message.scene.title_pusher;
          feedback.content = { content: message.message.toString() };
        }
        if (message.scene.type == 4) {
          feedback.question = message.scene.title_painter;
          feedback.content = { content: message.message };
        }
        if (message.scene.type == 5) {
          feedback.question = message.scene.title_voicer;
          feedback.content = {
            content: message.message,
            counter: this.counter,
          };
        }
        if (message.scene.type == 6) {
          feedback.question = message.scene.title_texter;
          feedback.content = { content: message.message };
        }

        if (message.scene.type == 7) {
          feedback.question = message.scene.title_imageup;
          feedback.content = { content: message.message };
        }

        this.incoming.push(message);
      }
    });
  },
  watch: {},

  methods: {
    randomSend() {
      let item = this.accepted.sort(() => 0.5 - Math.random())[0];
      this.send(item.id);
    },
    acceptAll() {
      this.incoming.forEach((inc) => {
        this.accept(inc.id);
      });
    },

    changeNoteIN(ix, newNote) {
      this.incoming[ix].node = newNote;
    },
    changeNoteAC(ix, newNote) {
      this.accepted[ix].node = newNote;
    },
    changeNoteDE(ix, newNote) {
      this.declined[ix].node = newNote;
    },

    forceRerender() {
      this.reRenderKey++;
    },
    deleteit(ix) {
      this.declined = this.declined.filter((f) => f.id !== ix);
      this.forceRerender();
    },

    changeIncoming() {
      this.forceRerender();
    },
    coolDownEnd(ix) {
      this.accept(ix);
    },

    decline(ix) {
      let feedbackOI = this.incoming.filter((f) => f.id == ix)[0];
      // let sId = feedbackOI.scene.ID;
      this.incoming = this.incoming.filter((f) => f.id !== ix);
      this.declined.push(feedbackOI);
      this.forceRerender();
    },

    declineMID(ix) {
      let feedbackOI = this.accepted.filter((f) => f.id == ix)[0];
      // let sId = feedbackOI.scene.ID;
      this.accepted = this.accepted.filter((f) => f.id !== ix);
      this.declined.push(feedbackOI);
      this.forceRerender();
    },

    accept(ix) {
      let feedbackOI = this.incoming.filter((f) => f.id == ix)[0];
      let sId = feedbackOI.scene.ID;
      this.incoming = this.incoming.filter((f) => f.id !== ix);

      if (this.autosend) {
        let fId = feedbackOI.insertId;
        this.socket.emit("admin_accept_scene", {
          sceneId: sId,
          feedbackId: fId,
        });
      } else {
        this.accepted.push(feedbackOI);
      }

      this.forceRerender();

      // this.socket.emit("admin_accept_scene", { sceneId: sId, feedbackId: fId });
    },
    send(ix) {
      let feedbackOI = this.accepted.filter((f) => f.id == ix)[0];
      let sId = feedbackOI.scene.ID;
      let fId = feedbackOI.insertId;
      this.socket.emit("admin_accept_scene", { sceneId: sId, feedbackId: fId });
    },
  },
};
</script>

<style scoped>
#app {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

.container {
  width: 100vw;
  height: calc(100vh - 112px);
  padding: 0px;
  margin: 0px;
  max-width: 100%;
  overflow: hidden;
}

.page-content {
  overflow: hidden;
  width: 100%;
  height: auto;
  display: flex;
}

.moderation-header {
  background: #7f7f7f !important;
  height: 70px !important;
  vertical-align: middle;
}

.feedback-list {
  overflow-y: auto;
  overflow-x: none;
  height: 80vh;
  width: 100%;
  background: #ccc;
}

.feedback-item-container {
  width: (100% - 20px);
  margin: 10px;
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
