<template>
  <div>
    <v-snackbar
      class="qr-snackbar"
      v-model="snackbar"
      bottom
      right
      multi-line
      elevated
      timeout="-1"
    >
      <v-container fill-height>
        <v-row
          fill-height
          align="center"
          justify="center"
          style="width: 100% !important"
        >
          <v-col align="center" justify="center" cols="12" lg="4" md="4" sm="4">
            <!-- QR Code Doc: https://gerardreches.github.io/vue-qrcode-component/ -->
            <qr-code
              :size="150"
              :text="url"
              color="white"
              bg-color="black"
            ></qr-code>
          </v-col>

          <v-col
            fill-height
            align="center"
            justify="center"
            cols="12"
            lg="6"
            md="6"
            sm="6"
            style="vertical-align: middle"
          >
            <p style="vertical-align: middle; text-align: left">
              Du kannst die <b>Fernbedienung</b> einfach auf Deinem Handy öffnen
              und das Video hier im Vollbild weiterschauen.
            </p>
            <br />
            <p>Nutze dazu den <b>QR-Code</b> oder öffne {{ url }}</p>
          </v-col>

          <v-col
            fill-height
            align="center"
            justify="center"
            cols="12"
            lg="1"
            md="1"
            sm="1"
          >
            <v-icon size="40" @click="snackbar = false" style="align: right">
              mdi-close-circle-outline
            </v-icon>
          </v-col>
        </v-row>
      </v-container>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    url: String,
  },

  name: "qR",

  computed: {},

  data() {
    return {
      snackbar: true,
    };
  },
  mounted() {
    // procedure which run after site loaded
    // this.interval = setInterval(() => this.updateAvg(), 100);
  },

  methods: {},
};
</script>

<style>
.qr-snackbar {
  width: 30%;
}
</style>
