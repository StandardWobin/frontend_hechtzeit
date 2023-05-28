<template>
  <v-footer :padless="true" class="footerSkipper" color="white">
    <v-card style="padding: 4px" width="100%">
      <v-progress-linear
        v-model="percentValueApi"
        stream
        height="3"
        color="orange"
      ></v-progress-linear>

      <v-progress-linear
        v-model="percentValue"
        stream
        height="8"
        color="red"
      ></v-progress-linear>

      <v-divider></v-divider>
      <div class="content">
        <v-btn @click="$emit('sceneLeft')" style="margin: 5px"
          ><v-icon large class="footer_arrows" color="red">
            mdi-arrow-left-drop-circle</v-icon
          ></v-btn
        >

        <p style="width: 100%; padding-top: 10px">{{ title }}</p>

        <v-btn @click="$emit('sceneRight')" style="margin: 5px"
          ><v-icon large class="footer_arrows" color="red">
            mdi-arrow-right-drop-circle</v-icon
          ></v-btn
        >
      </div>

      <v-divider></v-divider>

      <div style="text-align: center">
        <v-icon
          v-if="link"
          @click="
            () => {
              link = false;
              $emit('link-off');
            }
          "
        >
          mdi-link</v-icon
        >
        <v-icon
          v-if="!link"
          @click="
            () => {
              link = true;
              $emit('link-on');
            }
          "
        >
          mdi-link-off</v-icon
        >
      </div>
      <v-divider></v-divider>

      <div class="content">
        <v-btn
          :disabled="link"
          @click="$emit('sceneApiLeft')"
          class="footer_api"
          ><v-icon color="orange"> mdi-arrow-left-drop-circle</v-icon></v-btn
        >
        <p style="width: 100%; padding-top: 10px">{{ titleApi }}</p>

        <v-btn
          :disabled="link"
          @click="$emit('sceneApiRight')"
          class="footer_api"
          ><v-icon color="orange"> mdi-arrow-right-drop-circle</v-icon></v-btn
        >
      </div>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "sceneSkipper",
  components: {},
  props: {
    scene: Number,
    sceneApi: Number,

    title: String,
    titleApi: String,

    sceneAmount: Number,
  },

  computed: {},

  watch: {
    scene() {
      this.updatePercentValue();
    },

    sceneApi() {
      this.updatePercentValueApi();
    },

    sceneAmount() {
      this.updatePercentValue();
      this.updatePercentValueApi();
    },
  },
  data() {
    return {
      percentValue: 0,
      percentValueApi: 0,

      link: false,
    };
  },
  mounted() {
    this.updatePercentValue();
  },

  methods: {
    updatePercentValue() {
      this.percentValue = ((this.scene + 1) / this.sceneAmount) * 100;
    },

    updatePercentValueApi() {
      this.percentValueApi = ((this.sceneApi + 1) / this.sceneAmount) * 100;
    },
  },
};
</script>

<style scoped>
.content {
  display: flex;
  width: "100%";
  text-align: center;
}
.footerSkipper {
  width: 80%;
  height: 15vh;
  position: sticky;
  color: white;
  min-height: 15vh;
}

.footer_textmid {
  float: left;
  width: 60%;
}

.footer_arrows {
  float: left;
  width: 20%;
}

.footer_api {
  width: 1%;
  height: 2%;
  margin: 3px;
}
</style>
