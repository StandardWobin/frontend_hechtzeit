<template>
  <div>
    <img :src="data" height="150px" width="150px" />
  </div>
</template>

<script>
export default {
  name: "feedbackPainter",

  props: {
    data: String,
  },

  data() {
    return {};
  },

  methods: {},
};
</script>

<style></style>
