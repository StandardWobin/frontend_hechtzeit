<template>
  <div>
    <v-toolbar dark>
      <v-toolbar-title>{{ scene.title_mc }}</v-toolbar-title>
    </v-toolbar>

    <div class="interaction-content">
      <p>{{ scene.text_mc }}</p>

      <br />

      <v-btn
        :class="clicked === 1 ? 'mc-button-clicked' : 'mc-button'"
        id="button1"
        v-if="scene.size_mc >= 1 && scene.type_mc == 0"
        @click="call(1)"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
        >{{ scene.answer_text_1 }}</v-btn
      ><br v-if="scene.size_mc >= 1 && scene.type_mc == 0" /><br
        v-if="scene.size_mc >= 1 && scene.type_mc == 0"
      />
      <v-btn
        :class="clicked === 2 ? 'mc-button-clicked' : 'mc-button'"
        id="button2"
        v-if="scene.size_mc >= 2 && scene.type_mc == 0"
        @click="call(2)"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
        >{{ scene.answer_text_2 }}</v-btn
      ><br v-if="scene.size_mc >= 2 && scene.type_mc == 0" /><br
        v-if="scene.size_mc >= 2 && scene.type_mc == 0"
      />
      <v-btn
        :class="clicked === 3 ? 'mc-button-clicked' : 'mc-button'"
        id="button3"
        v-if="scene.size_mc >= 3 && scene.type_mc == 0"
        @click="call(3)"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
        >{{ scene.answer_text_3 }}</v-btn
      ><br v-if="scene.size_mc >= 3 && scene.type_mc == 0" /><br
        v-if="scene.size_mc >= 3 && scene.type_mc == 0"
      />
      <v-btn
        :class="clicked === 4 ? 'mc-button-clicked' : 'mc-button'"
        id="button4"
        v-if="scene.size_mc >= 4 && scene.type_mc == 0"
        @click="call(4)"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
        >{{ scene.answer_text_4 }}</v-btn
      ><br v-if="scene.size_mc >= 4 && scene.type_mc == 0" /><br
        v-if="scene.size_mc >= 4 && scene.type_mc == 0"
      />
      <v-btn
        :class="clicked === 5 ? 'mc-button-clicked' : 'mc-button'"
        id="button5"
        v-if="scene.size_mc >= 5 && scene.type_mc == 0"
        @click="call(5)"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
        >{{ scene.answer_text_5 }}</v-btn
      ><br v-if="scene.size_mc >= 5 && scene.type_mc == 0" /><br
        v-if="scene.size_mc >= 5 && scene.type_mc == 0"
      />
      <v-btn
        :class="clicked === 6 ? 'mc-button-clicked' : 'mc-button'"
        id="button6"
        v-if="scene.size_mc >= 6 && scene.type_mc == 0"
        @click="call(6)"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
        >{{ scene.answer_text_6 }}</v-btn
      ><br v-if="scene.size_mc >= 6 && scene.type_mc == 0" /><br
        v-if="scene.size_mc >= 6 && scene.type_mc == 0"
      />

      <v-checkbox
        dense
        v-if="scene.size_mc >= 1 && scene.type_mc == 1"
        @click="call(1)"
        :label="scene.answer_text_1"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
      ></v-checkbox>
      <v-checkbox
        dense
        v-if="scene.size_mc >= 2 && scene.type_mc == 1"
        @click="call(2)"
        :label="scene.answer_text_2"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
      ></v-checkbox>
      <v-checkbox
        dense
        v-if="scene.size_mc >= 3 && scene.type_mc == 1"
        @click="call(3)"
        :label="scene.answer_text_3"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
      ></v-checkbox>
      <v-checkbox
        dense
        v-if="scene.size_mc >= 4 && scene.type_mc == 1"
        @click="call(4)"
        :label="scene.answer_text_4"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
      ></v-checkbox>
      <v-checkbox
        dense
        v-if="scene.size_mc >= 5 && scene.type_mc == 1"
        @click="call(5)"
        :label="scene.answer_text_5"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
      ></v-checkbox>
      <v-checkbox
        dense
        v-if="scene.size_mc >= 6 && scene.type_mc == 1"
        @click="call(6)"
        :label="scene.answer_text_6"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
      ></v-checkbox>

      <v-radio-group v-if="scene.size_mc >= 1 && scene.type_mc == 2" column>
        <v-radio
          v-if="scene.size_mc >= 1 && scene.type_mc == 2"
          @click="call(1)"
          :label="scene.answer_text_1"
          :disabled="!active || (clicked >= 0 && !scene.reuse)"
        ></v-radio>
        <v-radio
          v-if="scene.size_mc >= 2 && scene.type_mc == 2"
          @click="call(2)"
          :label="scene.answer_text_2"
          :disabled="!active || (clicked >= 0 && !scene.reuse)"
        ></v-radio>
        <v-radio
          v-if="scene.size_mc >= 3 && scene.type_mc == 2"
          @click="call(3)"
          :label="scene.answer_text_3"
          :disabled="!active || (clicked >= 0 && !scene.reuse)"
        ></v-radio>
        <v-radio
          v-if="scene.size_mc >= 4 && scene.type_mc == 2"
          @click="call(4)"
          :label="scene.answer_text_4"
          :disabled="!active || (clicked >= 0 && !scene.reuse)"
        ></v-radio>
        <v-radio
          v-if="scene.size_mc >= 5 && scene.type_mc == 2"
          @click="call(5)"
          :label="scene.answer_text_5"
          :disabled="!active || (clicked >= 0 && !scene.reuse)"
        ></v-radio>
        <v-radio
          v-if="scene.size_mc >= 6 && scene.type_mc == 2"
          @click="call(6)"
          :label="scene.answer_text_6"
          :disabled="!active || (clicked >= 0 && !scene.reuse)"
        ></v-radio>
      </v-radio-group>

      <v-btn
        v-if="scene.type_mc == 1 || scene.type_mc == 2"
        :disabled="!active || (clicked >= 0 && !scene.reuse)"
        >Abschicken&nbsp;&nbsp;<v-icon>mdi-send</v-icon></v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    scene: Object,
    active: Boolean,
    evaluation: Object,
    clicked: Number,
  },

  name: "hz_mc",

  computed: {},

  data() {
    return {
      mc_holder: [],
    };
  },
  mounted() {},

  methods: {
    call(message) {
      this.$emit("call", this.scene, message);
    },
  },

  watch: {
    /*
    im pretty shure this if else logix is corret but untrivial an a bit redundant...
    TODO: rework this function / watch
    */
    evaluation(v) {
      var button1 = undefined;
      var button2 = undefined;
      var button3 = undefined;
      var button4 = undefined;
      var button5 = undefined;
      var button6 = undefined;

      if (
        v.type === 1 &&
        this.evaluation.result !== undefined &&
        this.scene.ID == this.evaluation.sceneID &&
        this.scene.show_eval
      ) {
        let sum = this.evaluation.result.reduce(
          (partialSum, a) => partialSum + a,
          0
        );
        this.mc_holder = new Array(this.evaluation.result.length).fill(0);

        if (sum !== 0) {
          for (let i = 0; i < this.mc_holder.length; i++) {
            this.mc_holder[i] = Math.round(
              (this.evaluation.result[i] / sum) * 100
            );
          }
        }

        button1 = document.getElementById("button1");
        button2 = document.getElementById("button2");
        button3 = document.getElementById("button3");
        button4 = document.getElementById("button4");
        button5 = document.getElementById("button5");
        button6 = document.getElementById("button6");

        if (button1 !== null) {
          if (this.mc_holder[0] == 0) {
            button1.style.background = "#272727";
          } else {
            button1.style.background =
              "linear-gradient(to left, #272727 " +
              (100 - this.mc_holder[0]) +
              "%, #34ad6f " +
              (100 - this.mc_holder[0]) +
              "%)";
          }
        }
        if (button2 !== null) {
          if (this.mc_holder[1] == 0) {
            button2.style.background = "#272727";
          } else {
            button2.style.background =
              "linear-gradient(to left, #272727 " +
              (100 - this.mc_holder[1]) +
              "%, #34ad6f " +
              (100 - this.mc_holder[1]) +
              "%)";
          }
        }
        if (button3 !== null) {
          if (this.mc_holder[2] == 0) {
            button3.style.background = "#272727";
          } else {
            button3.style.background =
              "linear-gradient(to left, #272727 " +
              (100 - this.mc_holder[2]) +
              "%, #34ad6f " +
              (100 - this.mc_holder[2]) +
              "%)";
          }
        }
        if (button4 !== null) {
          if (this.mc_holder[3] == 0) {
            button4.style.background = "#272727";
          } else {
            button4.style.background =
              "linear-gradient(to left, #272727 " +
              (100 - this.mc_holder[3]) +
              "%, #34ad6f " +
              (100 - this.mc_holder[3]) +
              "%)";
          }
        }
        if (button5 !== null) {
          if (this.mc_holder[4] == 0) {
            button5.style.background = "#272727";
          } else {
            button5.style.background =
              "linear-gradient(to left, #272727 " +
              (100 - this.mc_holder[4]) +
              "%, #34ad6f " +
              (100 - this.mc_holder[4]) +
              "%)";
          }
        }
        if (button6 !== null) {
          if (this.mc_holder[5] == 0) {
            button6.style.background = "#272727";
          } else {
            button6.style.background =
              "linear-gradient(to left, #272727 " +
              (100 - this.mc_holder[5]) +
              "%, #34ad6f " +
              (100 - this.mc_holder[5]) +
              "%)";
          }
        }
      } else {
        button1 = document.getElementById("button1");
        button2 = document.getElementById("button2");
        button3 = document.getElementById("button3");
        button4 = document.getElementById("button4");
        button5 = document.getElementById("button5");
        button6 = document.getElementById("button6");
        if (button1 !== null) {
          button1.style.background = "#272727";
        }
        if (button2 !== null) {
          button2.style.background = "#272727";
        }
        if (button3 !== null) {
          button3.style.background = "#272727";
        }
        if (button4 !== null) {
          button4.style.background = "#272727";
        }
        if (button5 !== null) {
          button5.style.background = "#272727";
        }
        if (button6 !== null) {
          button6.style.background = "#272727";
        }
      }
    },
  },
};
</script>

<style>
.interaction-content {
  padding: 3%;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}

#button1 {
  background: #272727;
  margin-top: 2vh;
}

#button2 {
  background: #272727;
  margin-top: 2vh;
}

#button3 {
  background: #272727;
  margin-top: 2vh;
}

#button4 {
  background: #272727;
  margin-top: 2vh;
}

#button5 {
  background: #272727;
  margin-top: 2vh;
}

#button6 {
  background: #272727;
  margin-top: 2vh;
}

.mc-button {
  width: 90%;
  height: 50px !important;
  margin-left: 5%;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
}

.mc-button-clicked {
  width: 95%;
  height: 55px !important;
  margin-left: 5%;
  border: 2px solid #1d4000;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
}

.divmc-button {
  width: 90%;
  height: 50px !important;
  margin-left: 5%;
  background: linear-gradient(to left, #272727 50%, #34ad6f 50%);
}
</style>
