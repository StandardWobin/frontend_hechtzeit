<template>
  <div
    data-app
    style="background-color: #999; overflow-y: scroll; height: 4000px"
  >
    <div>
      <v-dialog transition="dialog-bottom-transition" max-width="1000">
        <template v-slot:activator="{ on, attrs }">
          <div style="display: flex">
            <h2 style="position: relative; left: 30%; margin: 10px">
              List of your shows
            </h2>

            <v-btn
              v-bind="attrs"
              v-on="on"
              style="position: relative; left: 41%; margin: 10px"
              ><v-icon>mdi-plus</v-icon>NEUE SHOW</v-btn
            >
          </div>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar dark
              >Erstelle Sie eine neue show
              <v-btn
                @click="dialog.value = false"
                style="position: relative; left: 73%"
                >X</v-btn
              >
            </v-toolbar>

            <v-form
              ref="form"
              v-model="validForm"
              lazy-validation
              style="padding: 5vh"
            >
              <v-text-field
                label="Name der Show"
                v-model="new_show_name"
                counter
                maxlength="150"
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field
                label="LINK zur Show "
                v-model="new_show_link"
                counter
                hint="kann nicht mehr geändert werden"
                :rules="[rules.required, rules.onlyLetters]"
                maxlength="10"
              ></v-text-field>
              <v-btn
                :disabled="!validForm"
                @click="validate"
                style="margin-top: 1vh"
                >Erstellen</v-btn
              >
              <p>{{ responsemessage }}</p>
            </v-form>
          </v-card>
        </template>
      </v-dialog>
    </div>

    <v-progress-circular
      model-value="20"
      indeterminate
      v-if="loading"
    ></v-progress-circular>

    <ul id="shows" v-else>
      <li v-for="show in shows" :key="show.id">
        <v-card width="35vw" style="position: relative; left: 30vw">
          <v-toolbar>
            <h3>{{ show.name }}</h3>

            <div style="color: black; margin-left: 1vw; margin-right: 2vw">
              <p
                v-if="show.online"
                style="background-color: green; padding: 4px"
              >
                ONLINE
              </p>
              <p v-else>OFFLINE</p>
            </div>
          </v-toolbar>
          <div class="showlistelement">
            <div style="display: flex">
              <div>
                <p>modified: {{ show.lastmod }}</p>
                <p>ID : {{ show.link }}</p>
              </div>
              <v-btn
                type="SUBMIT"
                @click="editshow(show.link)"
                width="15vw"
                style="
                  color: #636363;
                  margin-left: 3vw;
                  background-color: #cca853;
                "
                >Enter Control Panel</v-btn
              >
            </div>

            <v-btn
              @click="open(url + '/live/' + show.link)"
              style="margin: 10px"
              >audience view<v-icon>mdi-open-in-new</v-icon></v-btn
            >
            <v-btn
              @click="open(url + '/webstage/' + show.link)"
              style="margin: 10px"
              >webstage<v-icon>mdi-open-in-new</v-icon></v-btn
            >
            <v-btn
              type="SUBMIT"
              @click="moderateshow(show.link)"
              style="margin: 10px"
              >moderation<v-icon>mdi-open-in-new</v-icon></v-btn
            >
          </div>
        </v-card>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "showList",
  components: {},
  data() {
    return {
      host: "",
      shows: [],
      url: "",
      dialog: false,
      new_show_name: "",
      new_show_link: "",
      instance: undefined,
      responsemessage: "",
      validForm: false,
      loading: true,
      rules: {
        required: (value) => !!value || "Feld darf nicht leer sein",
        onlyLetters: (value) => {
          const pattern = /^[a-zA-Z]+$/;
          return pattern.test(value) || "Es sind Buchstaben erlaubt (a-z)";
        },
      },
    };
  },

  watch: {
    new_show_link(v) {
      this.new_show_link = v.toUpperCase();
    },
  },

  methods: {
    open(page) {
      window.open(page);
    },

    validate() {
      this.$refs.form.validate();

      if (this.validForm) {
        this.submitNewShow();
        this.dialog = false;
        this.new_show_name = "";
        this.new_show_link = "";
      }

      //
    },
    submitNewShow() {
      this.instance
        .put(
          "/newshow?Link=" + this.new_show_link + "&name=" + this.new_show_name
        )
        .then((response) => {
          this.responsemessage = response.data;
          this.getShows();
        })
        .catch((error) => {
          if (error.response.status == 555) {
            this.responsemessage =
              "Show link is already used... please find another";
          } else {
            this.responsemessage =
              "das hat leider nicht geklappt" + error.response;
          }
        });
    },

    moderateshow(link) {
      // this.$router.push("/moderation?Link=" + link);
      this.open("/moderation?Link=" + link);
    },

    editshow(link) {
      this.$router.push("/show?Link=" + link);
    },

    getShows() {
      this.loading = true;
      this.instance
        .get("/shows")
        .then((response) => {
          this.shows = response.data;
          this.loading = false;
        })
        .catch((errors) => {
          console.log(errors);
          this.loading = false;
        });
    },
  },
  mounted() {
    this.host = process.env.VUE_APP_HOST;
    this.port = process.env.VUE_APP_BACKEND;

    if (process.env.NODE_ENV === "development") {
      this.url = this.host + ":" + this.port;
    } else {
      this.url = this.host;
    }
    // eslint-disable-next-line no-undef
    var token = $cookies.get("authenticatekey"); // return value

    this.instance = axios.create({
      baseURL:
        process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_BACKEND + "/api/",
      headers: { Authorization: "Bearer " + token },
    });

    this.getShows();
  },
};
</script>

<style>
.showlistelement {
  margin: 15px;
  padding: 10px;
}
</style>
