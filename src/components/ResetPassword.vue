<template>
  <v-container>
    <v-card class="mx-auto" max-width="500">
      <v-card-title class="justify-center">
        Reset your password
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
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4 justify-center"
                @click="validate"
              >
                Reset Password
              </v-btn>
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
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
  }),

  methods: {
    validate() {
      this.$refs.form.validate();

      if (this.valid === true) {
        this.resetPassword();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    resetPassword() {
      axios
        .post(
          "https://hiring-example-25770.botics.co/rest-auth/password/reset/",
          {
            email: this.email,
          }
        )
        .then((res) => {
          console.log(res);

          this.$emit("passwordReset", "passwordReset");

          this.$router.push({
            name: "Login",
          });
        })
        .catch((err) => console.log(err.response));
    },

    confirmResetPassword() {
      axios
        .post(
          "https://hiring-example-25770.botics.co/rest-auth/password/reset/confirm/",
          {
            email: this.email,
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
<style scoped>
.routerLink {
  text-decoration: none;
}
</style>
