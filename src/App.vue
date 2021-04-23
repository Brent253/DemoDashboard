<template>
  <v-app>
    <v-app-bar app color="blue-grey lighten-1">
      <v-icon> mdi-brush </v-icon>
      <v-container class="py-0 fill-height">
        <v-spacer></v-spacer>

        <div
          class="text-center"
          v-if="$route.path != '/' && $route.path != '/register'"
        >
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="200"
            offset-x
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                aria-hidden="false"
                color="blue-grey lighten-4"
                dark
                v-bind="attrs"
                v-on="on"
              >
                mdi-account
              </v-icon>
            </template>

            <v-card>
              <v-list>
                <v-list-item
                  v-for="(item, i) in toolbar"
                  :key="i"
                  link
                  @click="menuAction(item)"
                >
                  <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
              </v-list>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text @click="menu = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
      <v-footer color="blue-grey lighten-1" fixed>
        <v-col class="text-center" cols="12">
          {{ new Date().getFullYear() }} — <strong>Demo Dashboard</strong>
        </v-col>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "App",

  data: () => ({
    toolbar: ["Dashboard", "Messages", "Profile", "Logout"],
    menu: false,
    message: false,
    hints: true,
  }),

  methods: {
    logout() {
      axios
        .post("https://hiring-example-25770.botics.co/rest-auth/logout/")
        .then((res) => {
          console.log(res);
          localStorage.removeItem("ApiKey");
          this.menu = false;
          this.$router.push({
            name: "Login",
          });
        })
        .catch((err) => console.log(err.response));
    },

    menuAction(item) {
      if (item == "Dashboard") console.log("View Dashboard");
      else if (item == "Messages") console.log("View Messages");
      else if (item == "Profile") console.log("View Profile");
      else if (item == "Logout") this.logout();
    },
  },
};
</script>
