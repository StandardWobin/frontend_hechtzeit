<template>
  <div>
    <div
      style="position: relative; left: 10%; top: 10%; width: 80%; height: 80%"
    >
      <div style="display: flex">
        <div style="width: auto; height: 100%">
          <img
            style="
              position: relative;
              width: auto;
              max-width: 80vw;
              height: 100%;
            "
            :src="image"
            class="logo"
          />
        </div>

        <div style="width: 55vw" class="background" id="bg" v-if="!isMobile()">
          <div style="margin-top: 7%">
            <div>
              <p class="subheadliune">realtime interactions for theatre</p>
              <p class="headline">h<b>e</b>chtzeit</p>
            </div>

            <div
              style="
                background-color: #fff;
                width: 46vw;
                height: 4px;
                position: relative;
                left: 2vw;
              "
            ></div>
            <div style="display: flex; padding-top: 1vw">
              <p
                style="
                  position: relative;
                  top: 1vh;
                  left: 2vw;
                  max-width: 22vw;
                  text-align: justify;
                  color: #aaaaaa;
                "
              >
                Willkommen auf unserer Webseite, auf der Sie ein einzigartiges
                Tool finden, um Interaktionen für digitales Theater einfach zu
                erstellen! Wir wissen, wie wichtig Interaktionen im digitalen
                Theater sind und wie schwierig es sein kann, diese zu erstellen.
                Deshalb haben wir ein Tool entwickelt, das es Ihnen ermöglicht,
                interaktive Elemente für Ihre digitale Theateraufführung mit
                Leichtigkeit zu erstellen.
              </p>

              <div style="position: relative; top: 7vh; left: 4vw">
                <v-btn
                  v-if="!auth"
                  @click="$router.push('/login')"
                  style="background-color: #cca853; color: white"
                  >LOGIN</v-btn
                >
                <div v-if="auth" style="display: flex">
                  <p style="position: relative; top: 1vh; margin-right: 1vw">
                    welcome back |
                  </p>
                  <v-btn
                    @click="$router.push('/showlist')"
                    style="background-color: #cca853; color: white"
                    >View SHOWS</v-btn
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- LASY CODED MOBILE VIEW -->
      <div v-if="isMobile()">
        <p class="subheadliuneMobile">realtime interactions for theatre</p>
        <p class="headlineMobile">h<b>e</b>chtzeit</p>

        <div style="position: relative; top: 7vh; left: 4vw">
          <v-btn
            v-if="!auth"
            @click="$router.push('/login')"
            style="
              background-color: #cca853;
              color: white;
              position: relative;
              left: 25vw;
            "
            >LOGIN</v-btn
          >
          <div v-if="auth" style="display: flex">
            <p style="position: relative; top: 1vh; margin-right: 1vw">
              welcome back |
            </p>
            <v-btn
              @click="$router.push('/showlist')"
              style="background-color: #cca853; color: white"
              >View SHOWS</v-btn
            >
          </div>
        </div>
      </div>
    </div>
    <div
      style="
        color: #888;
        left: 50%;
        display: flex;
        position: absolute;
        top: 95%;
        transform: translate(-50%, 0%);
      "
    >
      <p>Impressum</p>
      <p style="padding-left: 1vw; padding-right: 1vw">|</p>
      <p>Datenschutz</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "homeLanding",

  data() {
    return {
      image: undefined,
      biginterval: undefined,
      smallinterval: undefined,
      auth: false,
    };
  },
  unmounted() {},
  beforeDestroy() {},
  mounted() {
    this.image = "man.png";

    // eslint-disable-next-line no-undef
    console.log($cookies.get("authenticatekey"));

    if (
      // eslint-disable-next-line no-undef
      $cookies.get("authenticatekey") !== null &&
      // eslint-disable-next-line no-undef
      $cookies.get("authenticatekey") !== ""
    ) {
      // eslint-disable-next-line no-undef
      var token = $cookies.get("authenticatekey") || "";

      axios
        .get(
          process.env.VUE_APP_HOST +
            ":" +
            process.env.VUE_APP_BACKEND +
            "/api/" +
            "/valid",
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then(() => {
          this.auth = true;
        })
        .catch(() => {
          this.auth = false;
        });
    }
  },
  methods: {
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    },

    isMobile() {
      let screeny = window.innerWidth <= 760;
      let agent =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      return screeny || agent;
    },
  },
};
</script>

<style>
@keyframes rotate {
  0% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* europa font NEED TO BE LOCAL */
@import url("https://use.typekit.net/vzs7nrg.css");

.subheadliune {
  font-size: 1vw;
  position: relative;
  left: 2vw;
  /* transform: translate(-50vw, -0%); */
  top: 0vh;
  font-family: Europa;
  color: #aaaaaa;
  letter-spacing: 0.55vw;
}

.headline {
  font-size: 7vw;
  font-weight: 500;
  font-family: Europa;
  position: relative;
  left: 2vw;
  /* transform: translate(-50vw, -0%); */
  color: #cca853;
  letter-spacing: 0.45vw;
}

.subheadliuneMobile {
  font-size: 4vw;
  position: relative;
  left: 2vw;
  /* transform: translate(-50vw, -0%); */
  top: 0vh;
  font-family: Europa;
  color: #aaaaaa;
  letter-spacing: 0.55vw;
}

.headlineMobile {
  font-size: 18vw;
  font-weight: 500;
  font-family: Europa;
  position: relative;
  left: 2vw;
  /* transform: translate(-50vw, -0%); */
  color: #cca853;
  letter-spacing: 0.45vw;
}

.headline b {
  font-weight: 700 !important;
}

.background {
  background: #eeeeee;
}

.logo {
  width: 100%;
  height: 100%;
  position: relative;
  left: 0;
  top: 0;
}
.home {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
