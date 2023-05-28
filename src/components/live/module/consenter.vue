<template>
  <v-app>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </template>

      <v-card>
        <div>
          <h1>consenter</h1>
          Mir ist klar dass alle meine Daten auf der Bühne verwendet und in die
          Show eingearbeitet werden können. Es ist auserdem möglich dass alle
          anderen Zuschauen meine abgesenden Nachrichten lesen.
          <br />
          <slot></slot>
          <br />
          Weiter Informationen findest du <a href="XXX">hier</a>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  props: {
    consent: Boolean,
  },

  name: "hz_consenter",

  data() {
    return {
      dialog: false,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style></style>
