<template>
  <div>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          Select Plan
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">
          Confirm Purchase
        </v-stepper-step>

        <v-divider></v-divider>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <div class="text-h5 text-center">
            <v-row justify="space-around">
              <v-col v-for="(plan, i) in plans" :key="i" cols="4">
                <v-card height="200" width="400" class="pa-2" tile
                  >{{ plan.name }}

                  <v-card-text>
                    <v-row justify="center">
                      {{ plan.description }}
                    </v-row>

                    <v-row justify="center"> ${{ plan.price }} </v-row>
                  </v-card-text>
                </v-card>
                <input
                  type="radio"
                  v-model="selectPlan"
                  name="selectPlan"
                  :value="plan.id"
                  @change="changePlan(plan.id, plan.name, plan.price)"
                />
              </v-col>
            </v-row>

            <v-btn color="primary" @click="e1 = 2">
              Continue
            </v-btn>

            <v-btn @click="close">close</v-btn>
          </div>
          <!-- <v-btn color="primary">Select</v-btn> -->
        </v-stepper-content>

        <v-stepper-content step="2">
          <div class="text-h5 text-center">
            <v-card class="mb-12" height="200px">
              <v-list dense>
                <v-subheader class="text-center">Confirm New Plan:</v-subheader>
                <v-list-item-group>
                  <v-list-item>
                    {{ planName }}
                    <v-spacer></v-spacer>
                    <!-- {{ planPrice }} -->
                    <!-- <v-text-field
                      label="Amount"
                      :value="planPrice"
                      prefix="$"
                      disabled
                    ></v-text-field> -->

                    <v-text-field
                      label="Card Number"
                      value="****-****-****-8888"
                      disabled
                    ></v-text-field>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>

            <v-btn color="primary" @click="addUpdateSubscription(subscription)">
              Confirm
            </v-btn>

            <v-btn @click="close">close</v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["plans", "currentPlan"],
  data() {
    return {
      e1: 1,
      selectPlan: null,
      planName: null,
      planPrice: null,
      card: "",
      subscription: null,
      plan: null,
    };
  },

  created() {
    this.subscription = this.currentPlan.subscription; //Subscription id

    this.getSubscriptions(this.subscription);
  },

  watch: {
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 3000);
    },

    currentPlan(val) {
      if (val) {
        console.log(val.subscription);
        this.subscription = val.subscription; //Subscription id
        this.getSubscriptions(this.subscription);
      }
    },
  },

  methods: {
    addUpdateSubscription(subscription) {
      //Add new subscription
      if (subscription == null || subscription == "") {
        axios
          .request({
            url: `${process.env.VUE_APP_SUBSCRIPTIONS}`,
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Token ${localStorage.getItem("ApiKey")}`,
            },
            data: {
              plan: this.selectPlan,
              app: this.currentPlan.id,
              active: true,
            },
          })
          .then((res) => {
            this.$emit("closeConfirm");
            this.selectPlan = null;

            this.overlay = false;
            console.log(res);
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else {
        if (subscription) {
          //Edit existing subscription
          console.log("Attempting to update subscription.");
          axios
            .request({
              url: `${process.env.VUE_APP_SUBSCRIPTIONS}${subscription}`,
              method: "put",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Token ${localStorage.getItem("ApiKey")}`,
              },
              data: {
                plan: this.selectPlan,
                app: this.currentPlan.id,
                active: true,
              },
            })
            .then((res) => {
              this.el = 1; //Reset steps
              this.$emit("closeConfirm");
              this.selectPlan = null;

              console.log(res);
            })
            .catch((err) => {
              console.log("fails here.");
              console.log(err.response);
            });
        }
      }
    },

    getSubscriptions(subscription) {
      this.selectPlan = null;

      if (subscription == null || subscription == "") {
        console.log("No active subscription for this app");

        this.selectPlan = this.plans[0].id;
      } else if (subscription) {
        axios
          .request({
            url: `${process.env.VUE_APP_SUBSCRIPTIONS}${this.subscription}`,
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Token ${localStorage.getItem("ApiKey")}`,
            },
          })
          .then((res) => {
            console.log("Current App Subscription");
            console.log(res.data);

            this.selectPlan = res.data.plan; // check if this matches subscription

            for (let plan in this.plans) {
              if (this.selectPlan == this.plans[plan].id)
                this.planName = this.plans[plan].name;
              this.planPrice = this.plans[plan].price;
            }
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    },

    changePlan(planID, planName, planPrice) {
      this.selectPlan = planID;
      this.planName = planName;
      this.planPrice = planPrice;
    },

    close() {
      this.$emit("closeConfirm");
      this.e1 = 1;
    },
  },
};
</script>
