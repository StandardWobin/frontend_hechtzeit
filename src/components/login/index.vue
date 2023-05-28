<template>
  <div style="background-color: #ccc" id="bg">
    <v-card
      class="mx-auto"
      style="position: relative; left: 35vw; margin-top: 5vh"
      max-width="500"
      variant="outlined"
    >
      <form
        @submit.prevent="login"
        style="width: 20vw; position: relative; left: 4vw"
      >
        <h1>Enter Control Panel</h1>
        <h4>Authentification required</h4>

        <v-text-field
          required
          v-model="username"
          type="text"
          placeholder="Email"
          label="Email"
        ></v-text-field>

        <v-text-field
          required
          v-model="password"
          type="password"
          label="Password"
          placeholder="Password"
        ></v-text-field>
        <hr />
        <v-btn
          type="submit"
          v-if="!loading"
          style="margin-top: 1vh; margin-bottom: 2vh"
          >Login</v-btn
        >
        <v-progress-circular
          model-value="20"
          indeterminate
          v-if="loading"
        ></v-progress-circular>
        <p v-if="wrongData">Nutzername oder Passwort Falsch.</p>
        <p v-if="wrongData && true">
          Error: {{ statuscode }} <br />
          Error: {{ errormessagecode }}
        </p>
      </form>
    </v-card>
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
  name: "loginForm",
  data() {
    return {
      username: "",
      password: "",
      wrongData: false,
      errormessagecode: "",
      loading: false,
    };
  },

  methods: {
    login() {
      this.loading = true;
      this.wrongData = false;
      const { username, password } = this;
      let data = {
        email: username,
        password: password,
      };
      axios
        .post(
          process.env.VUE_APP_HOST +
            ":" +
            process.env.VUE_APP_BACKEND +
            "/api/login",
          data
        )
        .then((response) => {
          // eslint-disable-next-line no-undef
          $cookies.set("authenticatekey", response.data.token);
          this.$router.push("/");
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.wrongData = true;
          this.statuscode = error.response.status;
          this.errormessagecode = error.response.data;
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.login {
  display: flex;
  flex-direction: column;
  position: relative;
  left: 20vw;
  left: 20vh;
  width: 300px;
  padding: 10px;
}
</style>
