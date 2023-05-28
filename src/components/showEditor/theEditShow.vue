<template>
  <v-dialog transition="dialog-bottom-transition" max-width="1000">
    <template v-slot:activator="{ on, attrs }">
      <v-icon color="#fff" v-bind="attrs" v-on="on">mdi-cog</v-icon>
    </template>

    <template v-slot:default="dialog">
      <v-card :key="updater">
        <v-toolbar dark>Einstellungen: {{ showIntern.name }}</v-toolbar>
        <v-card-text>
          <div class="flexy">
            <v-text-field
              label="Name of the Show (intern)"
              v-model="showIntern.name"
            ></v-text-field>

            <v-btn
              v-if="show.name !== showIntern.name"
              @click="$emit('updateShow', showIntern)"
            >
              <v-icon> mdi-content-save</v-icon></v-btn
            >
            <v-btn v-if="show.name !== showIntern.name" @click="resetShow()">
              <v-icon> mdi-cancel</v-icon></v-btn
            >
          </div>

          <v-switch
            v-model="showIntern.online"
            label="Online"
            :color="showIntern.online ? 'green' : 'red'"
            @change="$emit('updateShow', showIntern)"
          >
          </v-switch>

          <h2>Publikum</h2>
          <div class="flexy">
            <v-btn small @click="copy(url + '/live/' + showIntern.link)"
              ><v-icon>mdi-content-copy</v-icon></v-btn
            >

            <v-btn
              style="margin-right: 10px; margin-left: 10px"
              small
              @click="open(url + '/live/' + showIntern.link)"
              ><v-icon>mdi-open-in-new</v-icon></v-btn
            >
            <p>{{ url + "/live/" + showIntern.link }}</p>
          </div>

          <h2 style="margin-top: 15px">Moderation</h2>
          <div class="flexy">
            <v-btn
              small
              @click="copy(url + '/moderation?Link=' + showIntern.link)"
              ><v-icon>mdi-content-copy</v-icon></v-btn
            >

            <v-btn
              style="margin-right: 10px; margin-left: 10px"
              small
              @click="open(url + '/moderation?Link=' + showIntern.link)"
              ><v-icon>mdi-open-in-new</v-icon></v-btn
            >
            <p>{{ url + "/moderation?Link=" + showIntern.link }}</p>
          </div>

          <h2 style="margin-top: 15px">Webstage</h2>
          <div class="flexy">
            <v-btn small @click="copy(url + '/webstage/' + showIntern.link)"
              ><v-icon>mdi-content-copy</v-icon></v-btn
            >

            <v-btn
              style="margin-right: 10px; margin-left: 10px"
              small
              @click="open(url + '/webstage/' + showIntern.link)"
              ><v-icon>mdi-open-in-new</v-icon></v-btn
            >
            <p>{{ url + "/webstage/" + showIntern.link }}</p>
          </div>

          <div class="flexy">
            <v-text-field
              label="Offline Überschrift"
              v-model="showIntern.offline_name"
            ></v-text-field>
            <v-btn
              v-if="show.offline_name !== showIntern.offline_name"
              @click="$emit('updateShow', showIntern)"
            >
              <v-icon> mdi-content-save</v-icon></v-btn
            >

            <v-btn
              v-if="show.offline_name !== showIntern.offline_name"
              @click="resetShow()"
            >
              <v-icon> mdi-cancel</v-icon></v-btn
            >
          </div>

          <div class="flexy">
            <v-text-field
              style="margin-top: 00px"
              label="Offline Text"
              v-model="showIntern.offline_text"
            ></v-text-field>
            <v-btn
              v-if="show.offline_text !== showIntern.offline_text"
              @click="$emit('updateShow', showIntern)"
            >
              <v-icon> mdi-content-save</v-icon></v-btn
            >
            <v-btn
              v-if="show.offline_text !== showIntern.offline_text"
              @click="resetShow()"
            >
              <v-icon> mdi-cancel</v-icon></v-btn
            >
          </div>

          <div class="flexy">
            <v-text-field
              label="Steam URL"
              v-model="showIntern.stream_link"
            ></v-text-field>
            <v-btn
              v-if="show.stream_link !== showIntern.stream_link"
              @click="$emit('updateShow', showIntern)"
            >
              <v-icon> mdi-content-save</v-icon></v-btn
            >
            <v-btn
              v-if="show.stream_link !== showIntern.stream_link"
              @click="resetShow()"
            >
              <v-icon> mdi-cancel</v-icon></v-btn
            >
          </div>

          <div style="background-color: #888888">
            <img
              v-if="wantToUpload == 0"
              :src="logo"
              style="margin-left: 10px; width: 100px; height: 50px"
              alt="Logo kann nicht angezeigt werden"
              @click="
                wantToUpload = 1;
                uploader_options.target = uploader_options.target + '?target=1';
              "
            />

            <img
              v-if="wantToUpload == 0"
              style="
                margin-left: 10px;
                margin-top: -20px;
                width: 200px;
                height: 50px;
              "
              :src="image"
              alt="image kann nicht angezeigt werden"
              @click="
                wantToUpload = 2;
                uploader_options.target = uploader_options.target + '?target=2';
              "
            />

            <v-file-input
              v-if="wantToUpload != 0"
              label="File input"
              v-model="uploadFile"
              outlined
              dense
              capture="user"
              :rules="rules"
              accept="image/png, image/jpeg"
            ></v-file-input>

            <v-btn
              v-if="wantToUpload != 0"
              @click="$emit('upload', uploadFile, wantToUpload)"
              :disabled="uploadFile === undefined"
              ><v-icon>mdi-send</v-icon></v-btn
            >
          </div>

          <div class="flexy">
            <v-text-field
              v-model="deleteChecker"
              label="Schreibe internen show Namen zu löschen"
            ></v-text-field>
            <v-btn
              style="margin-top 20px"
              :disabled="show.name !== deleteChecker"
              @click="$emit('deleteShow')"
            >
              löschen
              <v-icon>mdi-delete</v-icon></v-btn
            >
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="(dialog.value = false), resetShow()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script>
import axios from "axios";

export default {
  name: "theEditShow",
  props: {
    url: String,
    show: Object,
  },
  components: {},
  data() {
    return {
      host: "",
      deleteChecker: "",
      wantToUpload: 0,
      updater: 0,
      dialog: false,
      logo: undefined,
      image: undefined,
      uploadFile: undefined,
      showIntern: {},
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
      uploader_options: {
        // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
        target:
          process.env.VUE_APP_HOST +
          ":" +
          process.env.VUE_APP_BACKEND +
          "/api/upload",
        testChunks: false,
        singleFile: false,
        simultaneousUploads: 1,
      },

      up_attrs: {
        accept: "image/jpg",
        single: true,
      },
    };
  },
  watch: {
    show() {
      this.showIntern = Object.assign({}, this.show);
      this.updater++;
      this.getImages();
    },
  },

  methods: {
    resetShow() {
      this.showIntern = Object.assign({}, this.show);
    },
    async copy(mytext) {
      try {
        await navigator.clipboard.writeText(mytext);
        alert("Copied");
      } catch ($e) {
        alert("Cannot copy");
      }
    },

    updateLogoImage(im) {
      this.showIntern.title_image = im;
      this.update_show(() => {});
    },

    open(page) {
      window.open(page);
    },

    getImages() {
      axios
        .get(this.url + "/api/showUser", {
          headers: { show: this.show.link },
        })
        .then((response) => {
          this.image = response.data.image;
          this.logo = response.data.logo;
        })
        .catch((errors) => {
          console.log(errors);
          // if resp is unauthorized, logout, to
        });
    },
    deleteImage(im, callback) {
      var que = "/deleteimage?Link=" + this.showIntern.link + "&image=" + im;
      this.instance
        .delete(que)
        .then(() => {
          callback();
        })
        .catch((errors) => {
          console.log(errors);
          // if resp is unauthorized, logout, to
        });
    },
  },

  mounted() {
    this.host = process.env.VUE_APP_HOST;
    // eslint-disable-next-line no-undef
    var token = $cookies.get("authenticatekey") || "";
    this.uploader_options.headers = { auth: token };
    this.showIntern = Object.assign({}, this.show);
  },
};
</script>

<style>
.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}

.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.flexy {
  display: flex;
  padding-top: 5px;
}
</style>
