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
                v-model="password"
                :rules="passwordRules"
                label="Password*"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                :rules="confirmPasswordRules"
                label="Confirm Password*"
                type="password"
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
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  password: "",
  confirmPassword: "",
  data: () => ({
    valid: true,
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length <= 10) || "Password must be less than 10 characters",
    ],

    confirmPasswordRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length <= 10) || "Password must be less than 10 characters",
    ],
  }),

  methods: {
    validate() {
      this.$refs.form.validate();

      if (this.valid === true) {
        this.changePassword();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    changePassword() {
      axios
        .post(
          "https://hiring-example-25770.botics.co/rest-auth/password/change/",
          {
            new_password1: this.password,
            new_password2: this.confirmPassword,
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
