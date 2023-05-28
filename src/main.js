import Vue from "vue";
import App from "./App";
import router from "./router";

import Vuetify from "vuetify/lib/framework";
Vue.use(Vuetify);

// externals
import "@mdi/font/css/materialdesignicons.css";

import VueQRCodeComponent from "vue-qrcode-component";
Vue.component("qr-code", VueQRCodeComponent);

import AudioVisual from "vue-audio-visual";
Vue.use(AudioVisual);

// canvas drawer
import VueKonva from "vue-konva";
Vue.use(VueKonva);

// cookies plugin
Vue.use(require("vue-cookies"));

import AVPlugin from "vue-audio-visual";
Vue.use(AVPlugin);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  template: "<App/>",
  vuetify: new Vuetify(),
  components: { App },
});
