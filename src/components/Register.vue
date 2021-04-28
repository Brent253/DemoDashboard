<template>
  <v-container>
    <v-card class="mx-auto" max-width="500">
      <v-card-title class="justify-center">
        Create account
      </v-card-title>
      <v-card-text class="text-center">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col>
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Name"
                required
              ></v-text-field>

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

              <v-checkbox
                v-model="checkbox"
                :rules="[(v) => !!v || 'You must agree to continue!']"
                label="I agree to the terms of service and privacy policy"
                required
              ></v-checkbox>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4 justify-center"
                @click="validate"
              >
                Sign up
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              Already have an account?
              <router-link :to="{ name: 'Login' }" class="routerLink"
                >Login Now</router-link
              >
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
  name: "Register",
  data: () => ({
    name: "",
    valid: true,
    password: "",
    repeatPassword: "",
    email: "",

    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 255) || "Name must be less than 255 characters",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length <= 10) || "Password must be less than 10 characters",
    ],
    checkbox: false,
  }),

  methods: {
    validate() {
      this.$refs.form.validate();

      if (this.valid === true) {
        this.$emit("registered", "registered");
        this.registerUser();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    registerUser() {
      axios
        .post(`${process.env.VUE_APP_REGISTRATION}`, {
          name: this.name,
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          console.log(res);
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
