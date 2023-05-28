<template>
  <v-app class="container" id="app" data-app>
    <v-toolbar class="show-header">
      <router-link to="/showlist"><v-icon>mdi-arrow-left</v-icon></router-link>

      <h2>&nbsp;{{ show.name }}&nbsp;</h2>

      <the-edit-show
        :url="url"
        :show="show"
        v-on:updateShow="updateShow"
        v-on:deleteShow="deleteShow"
        @upload="upload"
      ></the-edit-show>

      <div style="display: flex">
        <div :class="socket.connected ? 'onlinelight' : 'offlinelight'">
          <p>ADMIN</p>
        </div>
      </div>

      <div style="display: flex">
        <div
          :class="
            show.online && socket.connected ? 'onlinelight' : 'offlinelight'
          "
        >
          <p>Show</p>
        </div>
      </div>
    </v-toolbar>

    <v-row :class="isMobile() ? 'page-content-mobile' : 'page-content'">
      <!-- SCENES FRONTED -->
      <v-col
        cols="12"
        sm="12"
        :md="isMobile() ? 12 : 8"
        :lg="isMobile() ? 12 : 8"
      >
        <v-row>
          <v-col
            cols="12"
            sm="12"
            :md="isMobile() ? 12 : 4"
            :lg="isMobile() ? 12 : 4"
          >
            <the-scene-manager
              :scenes_frontend="scenes_frontend"
              :changenames_frontend="changenames_frontend"
              :sceneAudience="show.sceneAudience"
              :editorScene="frontend_editor_scene_number"
              :sceneApi="show.sceneAPI"
              :savingID="savingID"
              @drag_change_frontend="drag_change_frontend"
              @addScene_frontend="addScene_frontend"
              @sceneCut="sceneCut"
              @sceneCutApi="stageCut"
              @changeEditorScene="
                (index) => {
                  frontend_editor_scene_number = index;
                }
              "
            >
            </the-scene-manager>
          </v-col>

          <!-- SCENE EDITOR - BITTE REFACTOREN IN COMPONENT(S) // sag mir nicht was ich zu tun habe -->
          <v-col cols="12" sm="12" md="8" lg="8">
            <v-toolbar class="scenes-edit-header">
              <h3>Szene bearbeiten</h3>
            </v-toolbar>

            <div
              class="frontend_editor"
              v-if="!!scenes_frontend[frontend_editor_scene_number]"
            >
              <div class="frontend_editor_element">
                <!-- Scene Name -->
                <v-text-field
                  required
                  :rules="[
                    () =>
                      !!scenes_frontend[frontend_editor_scene_number].name ||
                      'This field is required',
                    (!!scenes_frontend[frontend_editor_scene_number].name &&
                      scenes_frontend[frontend_editor_scene_number].name
                        .length <= 20) ||
                      'This is to long',
                  ]"
                  counter="20"
                  maxlength="20"
                  @change="
                    scene_mod = true;

                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  style="width: 50%"
                  dense
                  label="Szenen-Name"
                  hint="Dieser Name wird nicht öffentlich angezeigt"
                  v-model="scenes_frontend[frontend_editor_scene_number].name"
                ></v-text-field>

                <v-btn
                  v-if="
                    show.sceneAudience ==
                    scenes_frontend[frontend_editor_scene_number].ID
                  "
                  :disabled="savingID !== undefined"
                  large
                  @click="
                    sceneCut(scenes_frontend[frontend_editor_scene_number].ID)
                  "
                  ><v-icon style="color: #ff1900" large
                    >mdi-cellphone-arrow-down</v-icon
                  >ZUSCHAUER UPDATE</v-btn
                >

                <v-btn
                  v-if="
                    show.sceneAudience !=
                    scenes_frontend[frontend_editor_scene_number].ID
                  "
                  :disabled="savingID !== undefined"
                  large
                  @click="
                    sceneCut(scenes_frontend[frontend_editor_scene_number].ID)
                  "
                  ><v-icon style="color: #06fc1a" large>mdi-play</v-icon>Szene
                  live schalten</v-btn
                >

                <v-btn
                  v-if="scene_mod"
                  :disabled="savingID !== undefined"
                  style="margin-left: 150px"
                  large
                  @click="
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number],
                      true
                    )
                  "
                  ><v-icon large>mdi-content-save</v-icon
                  ><v-progress-circular
                    v-if="savingID !== undefined"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-btn>

                <v-btn
                  v-if="scene_mod"
                  :disabled="savingID !== undefined"
                  large
                  @click="get_all_scenes_frontend()"
                  ><v-icon large>mdi-cancel</v-icon>
                  <v-progress-circular
                    v-if="savingID !== undefined"
                    indeterminate
                    color="primary"
                  ></v-progress-circular
                ></v-btn>
                <!-- Scene Settings -->

                <div style="display: flex">
                  <div>
                    <v-checkbox
                      v-model="
                        scenes_frontend[frontend_editor_scene_number].live
                      "
                      label="LIVE Bearbeitung der Szene (BETA)"
                      @change="
                        scene_mod = true;
                        update_scene_frontend(
                          scenes_frontend[frontend_editor_scene_number]
                        );
                      "
                    ></v-checkbox>

                    <v-checkbox
                      v-model="
                        scenes_frontend[frontend_editor_scene_number].reuse
                      "
                      label="Mehrfachantwort"
                      @change="
                        scene_mod = true;
                        update_scene_frontend(
                          scenes_frontend[frontend_editor_scene_number]
                        );
                      "
                    >
                    </v-checkbox>
                  </div>

                  <div style="margin-left: 100px">
                    <v-checkbox
                      v-model="
                        scenes_frontend[frontend_editor_scene_number].moderate
                      "
                      label="Feedback muss moderiert werden"
                      @change="
                        scene_mod = true;
                        update_scene_frontend(
                          scenes_frontend[frontend_editor_scene_number]
                        );
                      "
                    >
                    </v-checkbox>

                    <v-checkbox
                      v-model="
                        scenes_frontend[frontend_editor_scene_number].show_eval
                      "
                      label="Auswertung bei Zuschauenden"
                      @change="
                        scene_mod = true;
                        update_scene_frontend(
                          scenes_frontend[frontend_editor_scene_number]
                        );
                      "
                    >
                    </v-checkbox>
                  </div>
                </div>

                <v-btn
                  style="margin: 10px 3px 20px 3px"
                  @click="
                    resetFeedback(scenes_frontend[frontend_editor_scene_number])
                  "
                  >Feedback resetten</v-btn
                >
                <v-btn
                  style="margin: 10px 3px 20px 3px"
                  :color="
                    scenes_frontend[frontend_editor_scene_number].disabled
                      ? 'red'
                      : ''
                  "
                  @click="
                    () => {
                      scenes_frontend[frontend_editor_scene_number].disabled =
                        !scenes_frontend[frontend_editor_scene_number].disabled;
                      scene_mod = true;
                      update_scene_frontend(
                        scenes_frontend[frontend_editor_scene_number]
                      );
                    }
                  "
                >
                  {{
                    scenes_frontend[frontend_editor_scene_number].disabled
                      ? "Input aktivieren"
                      : "Input deaktivieren"
                  }}
                </v-btn>

                <div style="display: flex">
                  <v-icon color="orange" style="margin-right: 5px">
                    mdi-api
                  </v-icon>
                  <v-text-field
                    v-model="
                      scenes_frontend[frontend_editor_scene_number]
                        .customStageNumber
                    "
                    type="number"
                    label="StageNumber for API"
                    @change="
                      scene_mod = true;
                      update_scene_frontend(
                        scenes_frontend[frontend_editor_scene_number]
                      );
                    "
                  ></v-text-field>
                </div>

                <div class="changememoritz">
                  <v-btn
                    style="margin: 1px 3px 2px 3px"
                    :disabled="
                      scenes_frontend[frontend_editor_scene_number].countdown ==
                        0 ||
                      show.sceneAudience !=
                        scenes_frontend[frontend_editor_scene_number].ID
                    "
                    @click="
                      countDownStart(
                        scenes_frontend[frontend_editor_scene_number]
                      )
                    "
                  >
                    <v-icon style="color: #ff1900" small
                      >mdi-cellphone-arrow-down</v-icon
                    >Start</v-btn
                  >
                  <v-btn
                    style="margin: 1px 3px 2px 3px"
                    :disabled="
                      show.sceneAudience !=
                      scenes_frontend[frontend_editor_scene_number].ID
                    "
                    @click="
                      countDownReset(
                        scenes_frontend[frontend_editor_scene_number]
                      )
                    "
                  >
                    <v-icon style="color: #ff1900" small
                      >mdi-cellphone-arrow-down</v-icon
                    >
                    RESET</v-btn
                  >

                  <v-slider
                    v-model="
                      scenes_frontend[frontend_editor_scene_number].countdown
                    "
                    color="green"
                    label="Countdown"
                    min="0"
                    max="100"
                    thumb-label="always"
                    @change="
                      scene_mod = true;
                      update_scene_frontend(
                        scenes_frontend[frontend_editor_scene_number]
                      );
                    "
                  >
                    <template v-slot:thumb-label="{ value }">
                      {{ value }} s
                    </template>
                  </v-slider>
                </div>

                <v-slider
                  style="margin-left: 11vw; margin-top: 20px"
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].cooldown
                  "
                  color="green"
                  label="Cooldown"
                  hint="So lange müssen Zuschauende zwischen jeder Abstimmung warten"
                  min="0"
                  max="100"
                  thumb-label="always"
                  @change="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                >
                  <template v-slot:thumb-label="{ value }">
                    {{ value }} s
                  </template></v-slider
                >
              </div>

              <!-- <v-checkbox @input="update_scene_stage(scenes_frontend[frontend_editor_scene_number])" dense v-model="scenes_frontend[frontend_editor_scene_number].show_frontend_icon" label="Highlight"></v-checkbox>-->
              <!-- <v-checkbox @input="update_scene_stage(scenes_frontend[frontend_editor_scene_number])" dense v-model="scenes_frontend[frontend_editor_scene_number].pressable_frontend_icon" label="Live"></v-checkbox>-->
              <br />
              <v-divider></v-divider>
              <br />

              <!-- SCENE TYPE SETTINGS -->

              <div>
                <h2>Art der Interaktion</h2>
                <v-select
                  :items="front_end_scene_types"
                  item-text="state"
                  item-value="id"
                  v-model="scenes_frontend[frontend_editor_scene_number].type"
                  single-line
                  hint="Art der Interaktion"
                  @change="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                ></v-select>
              </div>

              <!-- TEXT SETTINGS  -->
              <div
                v-if="scenes_frontend[frontend_editor_scene_number].type == 0"
              >
                <div class="frontend_editor_element">
                  <br />
                  <v-text-field
                    required
                    @input="
                      scene_mod = true;
                      update_scene_frontend(
                        scenes_frontend[frontend_editor_scene_number]
                      );
                    "
                    style="margin-left: 10px; margin-right: 10px"
                    maxlength="45"
                    :rules="[
                      () =>
                        !!scenes_frontend[frontend_editor_scene_number]
                          .title_noop || 'This field is required',
                      (!!scenes_frontend[frontend_editor_scene_number]
                        .title_noop &&
                        scenes_frontend[frontend_editor_scene_number].title_noop
                          .length <= 45) ||
                        'This is to long',
                    ]"
                    counter
                    dense
                    label="Titel"
                    v-model="
                      scenes_frontend[frontend_editor_scene_number].title_noop
                    "
                  >
                  </v-text-field>

                  <div style="display: flex">
                    <v-btn
                      @click="show_picker_0 = !show_picker_0"
                      style="margin: 20px"
                    >
                      ICON:
                      <v-icon>
                        mdi-{{
                          scenes_frontend[frontend_editor_scene_number]
                            .icon_noop
                        }}</v-icon
                      >
                    </v-btn>

                    <div v-if="this.show_picker_0">
                      <v-text-field
                        v-model="
                          scenes_frontend[frontend_editor_scene_number]
                            .icon_noop
                        "
                      ></v-text-field>

                      <v-btn
                        style="margin: 10px"
                        @click="
                          () => {
                            scene_mod = true;
                            update_scene_frontend(
                              scenes_frontend[frontend_editor_scene_number]
                            );
                            show_picker_0 = false;
                          }
                        "
                        >SPEICHERN</v-btn
                      >
                    </div>
                  </div>
                  <v-textarea
                    style="margin-top: 10xp"
                    @input="
                      scene_mod = true;
                      update_scene_frontend(
                        scenes_frontend[frontend_editor_scene_number]
                      );
                    "
                    outlined
                    name="input-7-4"
                    label="Inhalt unter dem Icon"
                    v-model="
                      scenes_frontend[frontend_editor_scene_number].text_noop
                    "
                  ></v-textarea>
                </div>
              </div>

              <!-- MULTIPLE CHOICE SETTINGS-->
              <div
                v-if="scenes_frontend[frontend_editor_scene_number].type == 1"
              >
                <v-text-field
                  required
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  style="margin-left: 10px; margin-right: 10px"
                  maxlength="45"
                  :rules="[
                    () =>
                      !!scenes_frontend[frontend_editor_scene_number]
                        .title_mc || 'This field is required',
                    (!!scenes_frontend[frontend_editor_scene_number].title_mc &&
                      scenes_frontend[frontend_editor_scene_number].title_mc
                        .length <= 45) ||
                      'This is to long',
                  ]"
                  counter
                  dense
                  label="TITLE"
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].title_mc
                  "
                >
                </v-text-field>
                <v-textarea
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  outlined
                  name="input-7-4"
                  label="Outlined textarea"
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].text_mc
                  "
                ></v-textarea>

                <v-select
                  :items="mc_types"
                  item-text="state"
                  item-value="id"
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].type_mc
                  "
                  label="Typ"
                  single-line
                  @change="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                ></v-select>

                <v-slider
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].size_mc
                  "
                  :rules="rules.age"
                  color="green"
                  label="Anzahl der Antworten "
                  hint="Be honest"
                  min="1"
                  max="6"
                  thumb-label
                  @change="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                ></v-slider>
                <v-form>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          label="A"
                          @input="
                            scene_mod = true;
                            update_scene_frontend(
                              scenes_frontend[frontend_editor_scene_number]
                            );
                          "
                          v-if="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc >= 1
                          "
                          :disabled="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc < 2
                          "
                          v-model="
                            scenes_frontend[frontend_editor_scene_number]
                              .answer_text_1
                          "
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          label="B"
                          @input="
                            scene_mod = true;
                            update_scene_frontend(
                              scenes_frontend[frontend_editor_scene_number]
                            );
                          "
                          v-if="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc >= 2
                          "
                          :disabled="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc < 2
                          "
                          v-model="
                            scenes_frontend[frontend_editor_scene_number]
                              .answer_text_2
                          "
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          label="C"
                          @input="
                            scene_mod = true;
                            update_scene_frontend(
                              scenes_frontend[frontend_editor_scene_number]
                            );
                          "
                          v-if="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc >= 3
                          "
                          :disabled="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc < 3
                          "
                          v-model="
                            scenes_frontend[frontend_editor_scene_number]
                              .answer_text_3
                          "
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          label="D"
                          @input="
                            scene_mod = true;
                            update_scene_frontend(
                              scenes_frontend[frontend_editor_scene_number]
                            );
                          "
                          v-if="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc >= 4
                          "
                          :disabled="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc < 4
                          "
                          v-model="
                            scenes_frontend[frontend_editor_scene_number]
                              .answer_text_4
                          "
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          label="E"
                          @input="
                            scene_mod = true;
                            update_scene_frontend(
                              scenes_frontend[frontend_editor_scene_number]
                            );
                          "
                          v-if="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc >= 5
                          "
                          :disabled="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc < 5
                          "
                          v-model="
                            scenes_frontend[frontend_editor_scene_number]
                              .answer_text_5
                          "
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          label="F"
                          @input="
                            scene_mod = true;
                            update_scene_frontend(
                              scenes_frontend[frontend_editor_scene_number]
                            );
                          "
                          v-if="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc >= 6
                          "
                          :disabled="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_mc < 6
                          "
                          v-model="
                            scenes_frontend[frontend_editor_scene_number]
                              .answer_text_6
                          "
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </div>

              <!-- SLIDER SETTINGS -->
              <div
                v-if="scenes_frontend[frontend_editor_scene_number].type == 2"
              >
                <v-text-field
                  label="Textlinks"
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  v-model="
                    scenes_frontend[frontend_editor_scene_number]
                      .border_text_left_slider
                  "
                ></v-text-field>

                <v-text-field
                  label="Textrechts"
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  v-model="
                    scenes_frontend[frontend_editor_scene_number]
                      .border_text_right_slider
                  "
                ></v-text-field>

                <v-text-field
                  label="Title "
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  counter
                  maxlength="45"
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].title_slider
                  "
                ></v-text-field>

                <v-text-field
                  label="Text überm Slider"
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  v-model="
                    scenes_frontend[frontend_editor_scene_number]
                      .text_top_slider
                  "
                ></v-text-field>

                <v-text-field
                  label="Text untern Slider"
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  v-model="
                    scenes_frontend[frontend_editor_scene_number]
                      .text_bot_slider
                  "
                ></v-text-field>

                <v-text-field
                  label="Text AUF dem  Slider"
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  v-model="
                    scenes_frontend[frontend_editor_scene_number]
                      .avg_text_slider
                  "
                ></v-text-field>

                <v-checkbox
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].vertical
                  "
                  label="Vertical"
                  @change="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                >
                </v-checkbox>

                <v-slider
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].startvalue
                  "
                  :rules="rules.age"
                  color="orange"
                  label="Startwert für slider"
                  hint="Be honest"
                  min="1"
                  max="100"
                  thumb-label
                  @change="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                ></v-slider>
              </div>

              <!-- PUSHER SETTINGS -->
              <div
                v-if="scenes_frontend[frontend_editor_scene_number].type == 3"
              >
                <v-text-field
                  label="Title"
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  counter
                  maxlength="45"
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].title_pusher
                  "
                ></v-text-field>

                <v-text-field
                  label="text"
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].text_pusher
                  "
                ></v-text-field>
                <!--
                <v-text-field
                  label="avg text pusher"
                  @input="
                    scene_mod = true;
                    update_scene_frontend(scenes_frontend[frontend_editor_scene_number]);
                  "
                  v-model="scenes_frontend[frontend_editor_scene_number].avg_text_pusher"
                ></v-text-field> -->

                <v-slider
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].size_pusher
                  "
                  color="orange"
                  label="Anzahl der Knöpfe "
                  min="1"
                  max="4"
                  thumb-label="always"
                  @change="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                ></v-slider>
                <v-form>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-btn
                          v-if="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_pusher >= 1
                          "
                          @click="handlePicker(1)"
                        >
                          <v-icon>
                            mdi-{{
                              scenes_frontend[frontend_editor_scene_number]
                                .icon_1_pusher
                            }}</v-icon
                          >
                        </v-btn>
                        <v-text-field
                          @change="
                            scene_mod = true;
                            update_scene_frontend(
                              scenes_frontend[frontend_editor_scene_number]
                            );
                          "
                          v-if="show_picker_1"
                          v-model="
                            scenes_frontend[frontend_editor_scene_number]
                              .icon_1_pusher
                          "
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-btn
                          v-if="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_pusher >= 2
                          "
                          @click="handlePicker(2)"
                        >
                          <v-icon>
                            mdi-{{
                              scenes_frontend[frontend_editor_scene_number]
                                .icon_2_pusher
                            }}</v-icon
                          >
                        </v-btn>
                        <v-text-field
                          @change="
                            scene_mod = true;
                            update_scene_frontend(
                              scenes_frontend[frontend_editor_scene_number]
                            );
                          "
                          v-if="show_picker_2"
                          v-model="
                            scenes_frontend[frontend_editor_scene_number]
                              .icon_2_pusher
                          "
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-btn
                          v-if="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_pusher >= 3
                          "
                          @click="handlePicker(3)"
                        >
                          <v-icon>
                            mdi-{{
                              scenes_frontend[frontend_editor_scene_number]
                                .icon_3_pusher
                            }}</v-icon
                          >
                        </v-btn>
                        <v-text-field
                          @change="
                            scene_mod = true;
                            update_scene_frontend(
                              scenes_frontend[frontend_editor_scene_number]
                            );
                          "
                          v-if="show_picker_3"
                          v-model="
                            scenes_frontend[frontend_editor_scene_number]
                              .icon_3_pusher
                          "
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-btn
                          v-if="
                            scenes_frontend[frontend_editor_scene_number]
                              .size_pusher >= 4
                          "
                          @click="handlePicker(4)"
                        >
                          <v-icon>
                            mdi-{{
                              scenes_frontend[frontend_editor_scene_number]
                                .icon_4_pusher
                            }}</v-icon
                          >
                        </v-btn>

                        <v-text-field
                          @change="
                            scene_mod = true;
                            update_scene_frontend(
                              scenes_frontend[frontend_editor_scene_number]
                            );
                          "
                          v-if="show_picker_4"
                          v-model="
                            scenes_frontend[frontend_editor_scene_number]
                              .icon_4_pusher
                          "
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </div>

              <!-- PAINTER SETTINGS -->
              <div
                v-if="scenes_frontend[frontend_editor_scene_number].type == 4"
              >
                <v-text-field
                  label="Title"
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  counter
                  maxlength="45"
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].title_painter
                  "
                ></v-text-field>

                <v-text-field
                  label="text_painter"
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  v-model="
                    scenes_frontend[frontend_editor_scene_number].text_painter
                  "
                ></v-text-field>

                <v-text-field
                  label="button_text_painter"
                  @input="
                    scene_mod = true;
                    update_scene_frontend(
                      scenes_frontend[frontend_editor_scene_number]
                    );
                  "
                  v-model="
                    scenes_frontend[frontend_editor_scene_number]
                      .button_text_painter
                  "
                ></v-text-field>
              </div>

              <!-- VOICER SETTINGS  -->
              <div
                v-if="scenes_frontend[frontend_editor_scene_number].type == 5"
              >
                <div class="frontend_editor_element">
                  <br />
                  <v-text-field
                    required
                    @input="
                      scene_mod = true;
                      update_scene_frontend(
                        scenes_frontend[frontend_editor_scene_number]
                      );
                    "
                    style="margin-left: 10px; margin-right: 10px"
                    maxlength="45"
                    :rules="[
                      () =>
                        !!scenes_frontend[frontend_editor_scene_number]
                          .title_voicer || 'This field is required',
                      (!!scenes_frontend[frontend_editor_scene_number]
                        .title_voicer &&
                        scenes_frontend[frontend_editor_scene_number]
                          .title_voicer.length <= 45) ||
                        'This is to long',
                    ]"
                    counter
                    dense
                    label="Titel"
                    v-model="
                      scenes_frontend[frontend_editor_scene_number].title_voicer
                    "
                  >
                  </v-text-field>

                  <v-textarea
                    @input="
                      scene_mod = true;
                      update_scene_frontend(
                        scenes_frontend[frontend_editor_scene_number]
                      );
                    "
                    outlined
                    name="input-7-4"
                    label="Outlined textarea"
                    v-model="
                      scenes_frontend[frontend_editor_scene_number].text_voicer
                    "
                  ></v-textarea>
                </div>
              </div>

              <!-- TEXTER  -->
              <div
                v-if="scenes_frontend[frontend_editor_scene_number].type == 6"
              >
                <div class="frontend_editor_element">
                  <br />
                  <v-switch
                    v-model="
                      scenes_frontend[frontend_editor_scene_number].big_texter
                    "
                    label="bin ich dick?"
                    @change="
                      scene_mod = true;
                      update_scene_frontend(
                        scenes_frontend[frontend_editor_scene_number]
                      );
                    "
                  ></v-switch>

                  <v-text-field
                    required
                    @change="
                      scene_mod = true;
                      update_scene_frontend(
                        scenes_frontend[frontend_editor_scene_number]
                      );
                    "
                    style="margin-left: 10px; margin-right: 10px"
                    maxlength="50"
                    :rules="[
                      () =>
                        !!scenes_frontend[frontend_editor_scene_number]
                          .title_texter || 'This field is required',
                      (!!scenes_frontend[frontend_editor_scene_number]
                        .title_texter &&
                        scenes_frontend[frontend_editor_scene_number]
                          .title_texter.length <= 45) ||
                        'This is to long',
                    ]"
                    counter
                    dense
                    label="Titel"
                    v-model="
                      scenes_frontend[frontend_editor_scene_number].title_texter
                    "
                  >
                  </v-text-field>
                </div>
              </div>

              <!-- IMAGEUP  -->
              <div
                v-if="scenes_frontend[frontend_editor_scene_number].type == 7"
              >
                <div class="frontend_editor_element">
                  <br />
                  <v-text-field
                    required
                    @input="
                      scene_mod = true;
                      update_scene_frontend(
                        scenes_frontend[frontend_editor_scene_number]
                      );
                    "
                    style="margin-left: 10px; margin-right: 10px"
                    maxlength="50"
                    :rules="[
                      () =>
                        !!scenes_frontend[frontend_editor_scene_number]
                          .title_imageup || 'This field is required',
                      (!!scenes_frontend[frontend_editor_scene_number]
                        .title_imageup &&
                        scenes_frontend[frontend_editor_scene_number]
                          .title_imageup.length <= 50) ||
                        'This is to long',
                    ]"
                    counter="50"
                    dense
                    label="Titel"
                    v-model="
                      scenes_frontend[frontend_editor_scene_number]
                        .title_imageup
                    "
                  >
                  </v-text-field>
                </div>
              </div>

              <v-btn
                @click="
                  delete_scene_frontend_frontend(
                    scenes_frontend[frontend_editor_scene_number]
                  )
                "
                >Delete scene</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12" md="4" lg="4">
        <stream-player
          style="width: 100%; height: auto"
          :stream_link="show.stream_link"
        ></stream-player>

        <div
          style="display: flex"
          v-if="port !== undefined && show.link !== undefined"
        >
          <the-interaction-preview
            style="width: 50%"
            :frontendLink="url + '/live/' + show.link"
          ></the-interaction-preview>

          <the-api-preview :link="show.link"></the-api-preview>
        </div>

        <!---->
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" height="500" width="100%">
      DAS WAR NICHT ERFOLGREICH UND WAHRSCHEINLICH IST DAS BACKEND DOWN

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import axios from "axios";
// import VueIconPicker from "v-icon-picker";
import io from "socket.io-client";
import streamPlayer from "./streamPlayer.vue";
import theSceneManager from "./theSceneManager.vue";
import { v4 as uuidv4 } from "uuid";
import theEditShow from "./theEditShow.vue";
import theInteractionPreview from "./theInteractionPreview.vue";
import theApiPreview from "./theApiPreview.vue";

const width = window.innerWidth;
const height = window.innerHeight;

export default {
  name: "showEditor",
  components: {
    theSceneManager,
    theEditShow,
    streamPlayer,
    theApiPreview,
    theInteractionPreview,
  },
  data() {
    return {
      host: "",
      port: "",
      files: [],
      instance: {},
      show: {},
      snackbar: false,
      savingID: undefined,
      scene_mod: false,
      // scenes container
      scenes_frontend: [],
      scenes_stage: [],

      linesactivated: false,
      changenames_frontend: true,
      changenames_stage: true,

      stagelink: "",
      url: "",

      offlineInterval: undefined,

      ms_blend: 100,
      frontend_editor_scene_number: 0,
      stage_editor_scene_number: 0,
      show_picker_0: false,
      show_picker_1: false,
      show_picker_2: false,
      show_picker_3: false,
      show_picker_4: false,

      showImage: "",
      showMaster_stage: "",

      rules: {
        age: [(val) => val < 10 || `I don't believe you!`],
      },
      stageSize: {
        width: width,
        height: height,
      },

      connections: [],
      socket: {},

      front_end_scene_types: [
        { state: "Information", id: 0 },
        { state: "Umfrage", id: 1 },
        { state: "Slider", id: 2 },
        { state: "Knopf zum Drücken", id: 3 },
        { state: "Zeichenfläche", id: 4 },
        { state: "Sprachnachricht", id: 5 },
        { state: "Textnachricht", id: 6 },
        { state: "Bild senden", id: 7 },
      ],

      mc_types: [
        { state: "Buttons", id: 0 },
        { state: "Chechboxes", id: 1 },
        { state: "Radios", id: 2 },
      ],

      errorMessages: "",
    };
  },
  watch: {
    name() {
      this.errorMessages = "";
    },
  },

  methods: {
    upload(image, target) {
      let formData = new FormData(); // instantiate it
      formData.set("file", image);

      this.instance
        .put("/upload?target=" + target + "&link=" + this.show.link, formData, {
          headers: {
            "Content-Type": image.type,
            // eslint-disable-next-line no-undef
            Authorization: "Bearer " + $cookies.get("authenticatekey") || "",
          },
        })
        .then(() => {})
        .catch((errors) => {
          console.log(errors);
          // if resp is unauthorized, logout, to
        });
    },

    handlePicker(picker) {
      if (picker == 1) {
        this.show_picker_1 = !this.show_picker_1;
        if (this.show_picker_1) {
          this.show_picker_2 = false;
          this.show_picker_3 = false;
          this.show_picker_4 = false;
        }
      }

      if (picker == 2) {
        this.show_picker_2 = !this.show_picker_2;
        if (this.show_picker_2) {
          this.show_picker_1 = false;
          this.show_picker_3 = false;
          this.show_picker_4 = false;
        }
      }

      if (picker == 3) {
        this.show_picker_3 = !this.show_picker_3;
        if (this.show_picker_3) {
          this.show_picker_1 = false;
          this.show_picker_2 = false;
          this.show_picker_4 = false;
        }
      }

      if (picker == 4) {
        this.show_picker_4 = !this.show_picker_4;
        if (this.show_picker_4) {
          this.show_picker_1 = false;
          this.show_picker_2 = false;
          this.show_picker_3 = false;
        }
      }
    },

    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },

    generateApiKey() {
      this.show.api_key = uuidv4();
    },

    resetFeedback(scene) {
      var que = "/reseteval?Link=" + this.show.link + "&scid=" + scene.ID;
      this.instance
        .post(que)
        .then(() => {
          this.get_all_scenes_frontend();
        })
        .catch((errors) => {
          console.log(errors);
          // if resp is unauthorized, logout, to
        });
    },

    deleteShow() {
      var que = "/deleteshow?Link=" + this.show.link;
      this.instance
        .delete(que)
        .then(() => {
          window.location.href = "/showlist";
        })
        .catch((errors) => {
          console.log(errors);
          // if resp is unauthorized, logout, to
        });
    },
    delete_scene_frontend_frontend(scene) {
      var que = "/deletescene?Link=" + this.show.link + "&scid=" + scene.ID;
      this.instance
        .delete(que)
        .then(() => {
          this.get_all_scenes_frontend(() => {
            for (var i = 0; i < this.scenes_frontend.length; i++) {
              this.scenes_frontend[i].order = i;
            }
            this.updateAllScenes_frontend();
          });
        })
        .catch((errors) => {
          console.log(errors);
        });
    },

    delete_scene_frontend_stage(scene) {
      var que =
        "/deletescenestage?Link=" + this.show.link + "&scid=" + scene.idscene;
      this.instance
        .delete(que)
        .then(() => {
          this.get_all_scenes_frontend();
        })
        .catch((errors) => {
          console.log(errors);
          console.log("can not deletescene");
        });
    },

    sceneCut(sceneIx) {
      this.show.sceneAudience = sceneIx;
      this.updateShow(
        this.show,
        this.socket_frontend_scene_move_to_scene(this.show.sceneAudience)
      );
    },

    stageCut(sceneIx) {
      this.show.sceneAPI = sceneIx;
      this.updateShow(
        this.show,
        this.socket_stage_scene_move_to_scene(this.show.sceneAPI)
      );
    },

    drag_change_frontend(e, internProposal) {
      this.scenes_frontend = internProposal;

      for (var i = 0; i < this.scenes_frontend.length; i++) {
        this.scenes_frontend[i].order = i;
      }

      this.frontend_editor_scene_number = e.moved.newIndex;

      this.updateAllScenes_frontend();
    },

    updateText_frontend() {
      this.changenames_frontend = !this.changenames_frontend;
      if (this.changenames_frontend) {
        this.updateAllScenes_frontend();
      }
    },

    updateAllScenes_frontend() {
      for (var i = 0; i < this.scenes_frontend.length; i++) {
        this.update_scene_frontend(this.scenes_frontend[i], true, true);
      }
    },

    update_scene_frontend(scene, force, preventUpdate) {
      if (scene.live || force === true) {
        this.savingID = scene.ID;
        var url = "/update_scene_frontend?Link=" + this.show.link;

        scene.countdownstart = undefined;

        // console.log(scene);
        this.instance
          .put(url, scene)
          .then(() => {
            if (
              scene.live &&
              scene.show == this.show.link &&
              scene.ID == this.show.sceneAudience
            ) {
              this.socket_scene_frontend_force_reload();
            }

            if (!preventUpdate) {
              this.get_all_scenes_frontend(() => {
                this.savingID = undefined;
              });
            } else {
              this.savingID = undefined;
            }
          })
          .catch((errors) => {
            console.log(errors);
            this.snackbar = true;
            this.savingID = undefined;

            // if resp is unauthorized, logout, to
          });
      }
    },

    addScene_frontend() {
      this.instance
        .post("/newscene?Link=" + this.show.link)
        .then(() => {
          this.get_all_scenes_frontend();
        })
        .catch((errors) => {
          console.log(errors);
          // if resp is unauthorized, logout, to
        });
    },

    get_show(callback) {
      var link = this.$route.query.Link;
      this.instance
        .get("/show?Link=" + link)
        .then((response) => {
          this.show = response.data[0];
          this.frontendlink =
            "https://" +
            this.show.link +
            "." +
            window.location.hostname +
            ":" +
            process.env.VUE_APP_BACKEND +
            "/live";
          this.stagelink =
            "https://" +
            this.show.link +
            "." +
            window.location.hostname +
            ":" +
            process.env.VUE_APP_BACKEND +
            "/stage";

          typeof callback === "function" ? callback() : () => {};
        })
        .catch((errors) => {
          console.log(errors);
          // if resp is unauthorized, logout, to
        });
    },

    countDownReset(scene) {
      var que = "/countdownreset?Link=" + this.show.link;
      this.instance
        .put(que, scene)
        .then(() => {
          this.socket_scene_frontend_force_reload();
          this.socket_frontend_scene_move_to_scene(this.show.sceneAudience);
        })
        .catch((errors) => {
          console.log(errors);
          // if resp is unauthorized, logout, to
        });
    },

    countDownStart(scene) {
      var que = "/countdownstart?Link=" + this.show.link;

      this.instance
        .put(que, scene)
        .then(() => {
          this.socket_scene_frontend_force_reload();
          this.socket_frontend_scene_move_to_scene(this.show.sceneAudience);
        })
        .catch((errors) => {
          console.log(errors);
          // if resp is unauthorized, logout, to
        });
    },

    updateShow(show, callback) {
      var que = "/updateshow?Link=" + this.show.link;
      this.instance
        .put(que, show)
        .then(() => {
          this.get_show(() => {
            if (callback !== undefined) {
              callback();
            }
          });
        })
        .catch((errors) => {
          console.log(errors);
          // if resp is unauthorized, logout, to
        });
    },

    get_all_scenes_frontend(callback) {
      this.scene_mod = false;
      var link = this.$route.query.Link;
      // request shows from db
      this.instance
        .get("/scenes_frontend?Link=" + link)
        .then((response) => {
          this.scenes_frontend = response.data;
          if (typeof callback == "function") {
            callback();
          }
        })
        .catch((errors) => {
          console.log(errors);
        });
    },
    // SOCKET SENDS
    socket_scene_frontend_force_reload() {
      this.socket.emit("admin_scene_frontend_refresh", "");
    },
    socket_frontend_scene_move_to_scene(ix) {
      this.socket.emit("admin_scene_frontend_move", ix);
    },
    socket_stage_scene_move_to_scene(ix) {
      this.socket.emit("admin_scene_stage_move", ix);
    },
  },

  mounted() {
    document.title = "Admin - HECHTZEIT";
    // get host an port
    this.host = process.env.VUE_APP_HOST;
    this.port = process.env.VUE_APP_BACKEND;

    if (process.env.NODE_ENV === "development") {
      this.url = this.host + ":" + this.port;
    } else {
      this.url = this.host;
    }

    // acces authenticatekey where userid is stored (secure token from BACKEND)
    // eslint-disable-next-line no-undef
    var token = $cookies.get("authenticatekey") || "";

    // set url parament for requests, including auth
    const options = {
      baseURL:
        process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_BACKEND + "/api/",
      headers: { Authorization: "Bearer " + token },
    };
    this.instance = axios.create(options);

    // start socket.io connection to BACKEND
    (this.socket = io(
      process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_BACKEND + "/admin",
      {
        auth: {
          Authorization: "Bearer " + token + "$$$" + this.$route.query.Link,
        },
      }
    )),
      // get show information from BACKEND
      this.get_show();

    // get all scenen from this show
    this.get_all_scenes_frontend();

    // add socket.io callback on the socket
    // BACKEND updates scene (frontend, audience) id
    this.socket.on("goupdate_scene_frontendInShow", (sceneIx) => {
      this.show.sceneAudience = sceneIx;
    });

    // BACKEND updates scene (API, stage) id
    this.socket.on("goupdate_scene_stageInShow", (message) => {
      this.show.sceneAPI = message.newIx;
    });
  },
};
</script>

<style lang="scss" scoped>
.changememoritz {
  display: flex;
}

#app {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

.container {
  width: 100vw;
  height: calc(100vh - 112px);
  padding: 0px;
  margin: 0px;
  max-width: 100%;
  overflow: hidden;
}

.show-header {
  background: #7f7f7f !important;
  height: 70px !important;
}

.page-content {
  overflow: hidden;
  width: 100%;
  height: auto;
}

.page-content-mobile {
  overflow: hidden;
  width: 100vw;
  height: auto;
  padding: 10px;
  margin: 0;
}

.page-content-mobile .col-12 {
  padding: 0 !important;
}

.frontend_editor {
  background-color: #d7d7d7;
  height: calc(100vh - 200px);
  padding: 30px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: thin;
}

.buttonfrontend {
  margin-left: 300px;
  display: flex;
}

.frontendmaster {
  margin-left: 50px;
}

.columnside {
  float: left;
  width: 20%;
  background-color: #174ad4;
}

.colummid {
  float: left;
  width: 60%;
  background-color: #4da04d;
}

.leftmid {
  float: left;
  width: 50%;
  background-color: #96035e;
}

.rightmid {
  float: left;
  width: 50%;
  background-color: #dfab00;
}

.onlinelight {
  width: 100px;
  height: 25px;
  border-radius: 5px;
  background-color: #06fc1a;
  text-align: center;
  font-weight: 500;
  margin-left: 20px;
}

.offlinelight {
  width: 100px;
  height: 25px;
  border-radius: 5px;
  background-color: #ff1900;
  text-align: center;
  font-weight: 500;
  margin-left: 20px;
}

.masterviewfrontend {
  background-color: #bb194f;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
