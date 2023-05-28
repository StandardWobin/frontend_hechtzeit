<template>
  <div>
    <v-toolbar class="scenes-header">
      <h3>Szenen&nbsp;</h3>
      <v-icon color="#000" @click="$emit('addScene_frontend')">mdi-plus</v-icon>
    </v-toolbar>

    <draggable
      class="scrollable"
      v-model="scenes_frontend_intern"
      @change="$emit('drag_change_frontend', $event, scenes_frontend_intern)"
      draggable=".card-non-active"
    >
      <div
        v-for="(scene, index) in scenes_frontend_intern"
        :id="'fe' + scene.idscene"
        :key="scene.idscene"
        :class="
          sceneAudience == scene.order ? 'card-active' : 'card-non-active'
        "
      >
        <v-card
          :class="
            editorScene == index ? 'sceneelement' : 'sceneelement_non_active'
          "
          @click="$emit('changeEditorScene', index)"
        >
          <div v-if="scene.type == 0" class="scene-type">
            <v-badge
              v-if="scene.customStageNumber != -1"
              color="orange"
              :content="scene.customStageNumber"
              right
            >
              <v-icon large style="color: #fff">mdi-information-outline</v-icon>
            </v-badge>
            <v-icon v-else large style="color: #fff"
              >mdi-information-outline</v-icon
            >
          </div>
          <div v-if="scene.type == 1" class="scene-type">
            <v-badge
              v-if="scene.customStageNumber != -1"
              color="orange"
              :content="scene.customStageNumber"
              right
            >
              <v-icon large style="color: #fff">mdi-poll</v-icon>
            </v-badge>
            <v-icon v-else large style="color: #fff">mdi-poll</v-icon>
          </div>
          <div v-if="scene.type == 2" class="scene-type">
            <v-badge
              v-if="scene.customStageNumber != -1"
              color="orange"
              :content="scene.customStageNumber"
              right
            >
              <v-icon large style="color: #fff">mdi-arrow-left-right</v-icon>
            </v-badge>
            <v-icon  v-else large style="color: #fff">mdi-arrow-left-right</v-icon>
          </div>
          <div v-if="scene.type == 3" class="scene-type">
            <v-badge
              v-if="scene.customStageNumber != -1"
              color="orange"
              :content="scene.customStageNumber"
              right
            >
              <v-icon large style="color: #fff">mdi-cursor-pointer</v-icon>
            </v-badge>

            <v-icon v-else large style="color: #fff">mdi-cursor-pointer</v-icon>
          </div>
          <div v-if="scene.type == 4" class="scene-type">
            <v-badge
              v-if="scene.customStageNumber != -1"
              color="orange"
              :content="scene.customStageNumber"
              right
            >
              <v-icon large style="color: #fff">mdi-palette</v-icon>
            </v-badge>
            <v-icon v-else large style="color: #fff">mdi-palette</v-icon>
          </div>

          <div v-if="scene.type == 5" class="scene-type">
            <v-badge
              v-if="scene.customStageNumber != -1"
              color="orange"
              :content="scene.customStageNumber"
              right
            >
              <v-icon large style="color: #fff">mdi-microphone</v-icon>
            </v-badge>
            <v-icon v-else large style="color: #fff">mdi-microphone</v-icon>
          </div>

          <div v-if="scene.type == 6" class="scene-type">
            <v-badge
              v-if="scene.customStageNumber != -1"
              color="orange"
              :content="scene.customStageNumber"
              right
            >
              <v-icon large style="color: #fff">mdi-format-textbox</v-icon>
            </v-badge>
            <v-icon v-else large style="color: #fff">mdi-format-textbox</v-icon>
          </div>

          <div v-if="scene.type == 7" class="scene-type">
            <v-badge
              v-if="scene.customStageNumber != -1"
              color="orange"
              :content="scene.customStageNumber"
              right
            >
              <v-icon large style="color: #fff">mdi-message-image</v-icon>
            </v-badge>
            <v-icon v-else large style="color: #fff">mdi-message-image</v-icon>
          </div>

          <div class="scene-name">
            {{ scene.name }}
          </div>

          <v-icon
            v-if="sceneApi == scene.ID && savingID !== scene.ID"
            large
            fab
            style="color: orange"
            @click.stop
            @click="$emit('sceneCutApi', scene.ID)"
            >mdi-api
          </v-icon>

          <v-icon
            v-if="sceneApi !== scene.ID && savingID !== scene.ID"
            large
            fab
            style="color: #06fc1a"
            :disabled="link"
            @click.stop
            @click="$emit('sceneCutApi', scene.ID)"
            >mdi-api
          </v-icon>

          <div class="scene-control">
            <v-icon
              v-if="sceneAudience !== scene.ID && savingID !== scene.ID"
              large
              fab
              style="color: #06fc1a"
              @click="$emit('sceneCut', scene.ID)"
              >mdi-play</v-icon
            >
            <v-icon
              v-if="sceneAudience === scene.ID && savingID !== scene.ID"
              large
              fab
              style="color: #ff1900"
              @click="$emit('sceneCut', scene.ID)"
              >mdi-cellphone</v-icon
            >
            <v-progress-circular
              v-if="savingID === scene.ID"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-card>
      </div>
    </draggable>
    <div v-if="scenes_frontend_intern.length > 0">
      <scene-skipper
        class="skipper"
        v-if="scenes_frontend.length > 0"
        :scene="sceneAudience"
        :sceneApi="sceneApi"
        :sceneAmount="scenes_frontend.length"
        :title="
          scenes_frontend_intern.find((el) => {
            return el.ID == sceneAudience;
          }) !== undefined
            ? scenes_frontend_intern.find((el) => {
                return el.ID == sceneAudience;
              }).name
            : ''
        "
        :titleApi="
          scenes_frontend_intern.find((el) => {
            return el.ID == sceneAudience;
          }) !== undefined
            ? scenes_frontend_intern.find((el) => {
                return el.ID == sceneAudience;
              }).name
            : ''
        "
        @sceneLeft="sceneLeft()"
        @sceneRight="sceneRight()"
        @sceneApiLeft="sceneLeftApi()"
        @sceneApiRight="sceneRightApi()"
        @link-on="link = true"
        @link-off="link = false"
      ></scene-skipper>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import sceneSkipper from "./sceneSkipper.vue";

export default {
  name: "theSceneManager",
  props: {
    scenes_frontend: Array,
    changenames_frontend: Boolean,
    sceneAudience: Number,
    editorScene: Number,
    sceneApi: Number,
    savingID: Number,
  },
  components: {
    draggable,
    sceneSkipper,
  },
  data() {
    return {
      scenes_frontend_intern: [],
      link: false,
    };
  },
  watch: {
    link(v) {
      if (v) {
        this.$emit("sceneCutApi", this.sceneAudience);
      }
    },

    sceneAudience(v) {
      if (this.link) {
        this.$emit("sceneCutApi", v);
      }
    },

    scenes_frontend() {
      this.scenes_frontend_intern = this.scenes_frontend;
    },
  },

  methods: {
    sceneLeft() {
      let index = this.scenes_frontend_intern.findIndex((el) => {
        return el.ID == this.sceneAudience;
      });
      let newIndex = Math.max(0, index - 1);
      let newID = this.scenes_frontend_intern[newIndex].ID;
      if (index != newIndex) {
        this.$emit("sceneCut", newID);
      }
    },

    sceneRight() {
      let index = this.scenes_frontend_intern.findIndex((el) => {
        return el.ID == this.sceneAudience;
      });
      let newIndex = Math.min(
        this.scenes_frontend_intern.length - 1,
        index + 1
      );
      let newID = this.scenes_frontend_intern[newIndex].ID;
      if (index != newIndex) {
        this.$emit("sceneCut", newID);
      }
    },

    sceneLeftApi() {
      let index = this.scenes_frontend_intern.findIndex((el) => {
        return el.ID == this.sceneApi;
      });
      let newIndex = Math.max(0, index - 1);
      let newID = this.scenes_frontend_intern[newIndex].ID;
      if (index != newIndex) {
        this.$emit("sceneCutApi", newID);
      }
    },

    sceneRightApi() {
      let index = this.scenes_frontend_intern.findIndex((el) => {
        return el.ID == this.sceneApi;
      });
      let newIndex = Math.min(
        this.scenes_frontend_intern.length - 1,
        index + 1
      );
      let newID = this.scenes_frontend_intern[newIndex].ID;
      if (index != newIndex) {
        this.$emit("sceneCutApi", newID);
      }
    },
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
.scrollable {
  overflow-x: hidden;
  overflow-y: auto;
  height: 70vh;
  padding-right: 15px;
}
.card-active {
  display: flex;
}

.card-non-active {
  display: flex;
}
.sceneelement_non_active {
  background: rgb(255, 255, 255);
  margin: 8px;
  display: flex;
  width: 100%;
  height: 60px;
  flex-direction: row;
  -webkit-box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
}

.sceneelement {
  background: rgb(220, 220, 220);
  border-radius: 8px;
  margin: 5px;
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  -webkit-box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.5);
  color: #000;
  font-weight: 300;
}

.scene-type {
  display: flex;
  background: #5a5a5a;
  width: 60px;
  height: 60px;
  color: #fff;
  padding: 10px;
}

.scene-name {
  display: flex;
  align-content: center;
  justify-self: flex-start;
  font-weight: 500;
  padding: 20px;
  width: calc(100% - 120px);
  font-size: 16px;
}

.scene-control {
  display: flex;
  width: 60px;
  height: 60px;
  color: #fff;
  padding: 10px;
}

.skipper {
  position: relative;
  text-align: center;
  bottom: 0px;
  width: 100%;
  margin-top: 10px;
  padding-left: 1vw;
  padding-right: 1vw;
  padding-bottom: 100px;
}
</style>
