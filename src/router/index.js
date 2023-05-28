/* eslint-disable no-undef */
import Vue from "vue";
import axios from "axios";

import Router from "vue-router";
import loginForm from "components/login";
import liveAudience from "components/live";
import homeLanding from "components/home";
import showList from "components/showList";
import showEditor from "components/showEditor";
import theModeration from "components/moderation";
import webStage from "components/webStage";
Vue.use(Router);

const checkValid = (sux, fail) => {
  if (
    $cookies.get("authenticatekey") !== null &&
    $cookies.get("authenticatekey") !== ""
  ) {
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
        sux();
      })
      .catch(() => {
        console.log("fail1");
        fail();
      });
  } else {
    fail();
  }
};

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: homeLanding,
    },

    {
      // NEED AUTH
      path: "/show",
      name: "Show",
      component: showEditor,
    },

    {
      // NEED AUTH
      path: "/moderation",
      name: "Moderation",
      component: theModeration,
    },

    {
      // NEED AUTH
      path: "/webstage/:link",
      name: "Webstage",
      component: webStage,
    },
    {
      // NEED AUTH
      path: "/showlist",
      name: "Showlist",
      component: showList,
    },

    {
      path: "/login",
      name: "Login",
      component: loginForm,
    },

    {
      path: "/live/:link",
      name: "Live",
      component: liveAudience,
    },

    {
      path: "/API",
      name: "API",
    },
  ],
});

router.beforeEach((to, from, next) => {
  // ////////////////////////////////////////////////////////////////////////
  // "protected" admin area
  if (to.name == "Show" || to.name == "Showlist" || to.name == "Moderation") {
    checkValid(
      () => {
        next();
        return;
      },
      () => {
        next("/login");
        return;
      }
    );
  } else if (to.name == "Home" || to.name == "Login") {
    next();
  } else if (
    to.path.includes("live") ||
    to.path.includes("Live") ||
    to.path.includes("Webstage") ||
    to.path.includes("webstage")
  ) {
    next();
  } else if (to.name == "API") {
    axios.get("/api/API").then().catch();
  }
});

export default router;
