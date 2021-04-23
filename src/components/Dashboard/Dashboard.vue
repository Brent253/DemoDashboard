<template>
  <div>
    <v-main class="blue-grey lighten-4">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg" color="grey lighten-4">
              <v-list color="transparent">
                <v-list-item link color="grey lighten-4">
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail*"
                        required
                      ></v-text-field>
                      <v-btn
                        color="success"
                        class="mr-4 justify-center"
                        @click="verifyEmail"
                      >
                        Verify Email
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet min-height="81vh" rounded="lg" color="grey lighten-4">
              <div class="applist">
                <v-subheader><strong>Overview</strong></v-subheader>
                <AppsList @updateDialog="upgradePlans" />
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import axios from "axios";
import AppsList from "./AppsList";
export default {
  name: "Dashboard",
  data: () => ({
    plans: [],
    links: ["Dashboard", "Messages", "Profile", "Updates"],
    toolbar: ["Dashboard", "Messages", "Profile", "Change Plan"],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    token: null,
    dialog: false,
    row: null,
    currentPlan: null,
  }),
  components: {
    AppsList,
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      console.log(localStorage.getItem("ApiKey"));
      this.getUser();
    },

    upgradePlans(plan) {
      console.log(plan);
      this.currentPlan = plan;
      this.dialog = true;
    },

    menuAction(item) {
      if (item == "Change Plan") this.dialog = true;
      if (item == "StoryBoard") console.log("Storyboard");
      if (item == "Status") console.log("Status");
    },

    getUser() {
      axios
        .request({
          url: `https://hiring-example-25770.botics.co/rest-auth/user/`,
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem("ApiKey")}`,
          },
        })
        .then((res) => {
          console.log("User");
          console.log(res.data);
          this.selectPlan = res.data.plan;
        })
        .catch((err) => {
          console.log(err.response);
        });
    },

    verifyEmail() {
      axios
        .post(
          "https://hiring-example-25770.botics.co/rest-auth/registration/verify-email/",
          {
            key: localStorage.getItem("ApiKey"),
          }
        )
        .then((res) => {
          console.log(res);

          this.$router.push({
            name: "Login",
          });
        })
        .catch((err) => console.log(err.response));
    },
  },
};
</script>

<style scoped></style>
