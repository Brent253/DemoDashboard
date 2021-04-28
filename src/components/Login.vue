<template>
  <v-container>
    <v-card class="mx-auto" max-width="500">
      <v-card-title class="justify-center">
        Login to Dashboard
      </v-card-title>
      <v-card-text class="text-center">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail*"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password*"
                type="password"
                required
              ></v-text-field>
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4 justify-center"
                @click="validate"
              >
                Login
              </v-btn>
              <router-link class="routerLink" :to="{ name: 'ResetPassword' }">
                Forgot Password?
              </router-link>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              Don't have an account?
              <router-link class="routerLink" :to="{ name: 'Register' }">
                Register Now
              </router-link>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data: () => ({
    valid: true,
    email: "",
    password: "",
    links: ["Dashboard", "Messages", "Profile", "Updates"],
    toolbar: ["Status", "StoryBoard", "Change Plan"],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length <= 10) || "Password must be less than 10 characters",
    ],
  }),

  methods: {
    validate() {
      this.$refs.form.validate();

      if (this.valid === true) {
        this.$emit("signedIn", "signedIn");
        this.login();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    login() {
      axios
        .post(`${process.env.VUE_APP_LOGIN}`, {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          console.log(res);
          console.log("Successfuly logged in");
          localStorage.setItem("ApiKey", res.data.key);
          this.$router.push({
            name: "Dashboard",
          });
        })
        .catch((err) => console.log(err.response));
    },
  },
};
</script>

<style scoped>
.routerLink {
  text-decoration: none;
}
</style>
