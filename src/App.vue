<template>
  <div id="app">
    <div class="main-container">
      <router-view class="router-view" />
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      livePage: false,
    };
  },

  mounted() {
    console.log("HOST: " + process.env.VUE_APP_HOST);
    console.log("MODE: " + process.env.NODE_ENV);
    if (window.location.href.includes("live")) {
      this.livePage = true;
    }

    document.title = "HECHTZEIT";
    if (this.livePage == true) {
      document.title = "LIVESHOW";
    }
  },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
  background: #1a1a1a;
  overflow: hidden;
}

#app {
  overflow: hidden;
  font-family: "Roboto", sans-serif;
}

.main-container {
  min-height: calc(100vh - 70px);
  width: 100vw;
  overflow: hidden;
}

.center-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.router-view {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
