<template>
  <div>
    <v-container class="container">
      <v-row justify="center" class="row">
        <v-data-table
          :headers="headers"
          :items="applist"
          sort-by="name"
          class="elevation-1"
          :loading="loading"
          dense
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Apps list</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>

              <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Application name"
                          ></v-text-field>

                          <v-text-field
                            v-model="editedItem.description"
                            label="Description"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="headline"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.upgrade="{ item }">
            <v-chip color="blue-grey lighten-1" dark @click="updatePlan(item)"
              >Upgrade
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)" color="#880E4F">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-row>
      <div class="adduser">
        <v-row justify="center">
          <v-btn
            color="blue-grey lighten-1"
            dark
            class="mb-2"
            @click="dialog = true"
          >
            Create App
          </v-btn>
        </v-row>
      </div>
    </v-container>

    <v-snackbar v-model="snackbar" :color="color" top>
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-row justify="center">
      <v-col cols="auto">
        <v-dialog
          transition="dialog-bottom-transition"
          max-width="600"
          v-model="subscriptionDialog"
        >
          <template>
            <v-card>
              <v-toolbar color="blue-grey lighten-1" dark>
                <v-spacer />
                <v-toolbar-title>
                  Change New app Subscription
                </v-toolbar-title>
                <v-spacer />
              </v-toolbar>

              <v-card-text>
                <v-container>
                  <ChangePlan
                    :plans="plans"
                    :currentPlan="currentPlan"
                    @closeConfirm="closeSubscription"
                  />
                </v-container>
              </v-card-text>
              <!-- <v-card-actions class="justify-end">
                <v-btn text @click="closeSubscription">Close</v-btn>
              </v-card-actions> -->
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ChangePlan from "./ChangePlan";
const axios = require("axios");
export default {
  name: "Login",

  data: () => ({
    //notifications
    snackbar: false,
    text: "",
    vertical: true,
    color: "success",
    plans: [],
    currentPlan: null,
    //overlay
    overlay: false,

    token: null,

    //Dialogs for view/edit/adding applist
    dialog: false,
    subscriptionDialog: false,

    dialogDelete: false,

    //Loads table when fetching data
    loading: true,

    //Used for passing row id
    selected: null,

    //Table headers, values and options associated with table
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "Description",
        value: "description",
        sortable: false,
        align: "start",
      },
      {
        text: "Subscription",
        value: "upgrade",
        sortable: false,
        align: "center",
      },
      { text: "Actions", value: "actions", sortable: false, align: "end" },
    ],

    //Array of applist to add to table
    applist: [],

    //Table item and indexed row
    editedIndex: -1,

    editedItem: {
      id: "",
      name: "",
      description: "",
      type: "",
      framework: "",
      domain_name: "",
      screenshot: "",
      subscription: "",
      user: "",
      created_at: "",
      updated_at: "",
    },
    defaultItem: {
      id: "",
      name: "",
      description: "",
      type: "",
      framework: "",
      domain_name: "",
      screenshot: "",
      subscription: "",
      user: "",
      created_at: "",
      updated_at: "",
    },
  }),

  components: {
    ChangePlan,
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Create App" : "Edit App";
    },
  },

  watch: {
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 3000);
    },

    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },

    subscriptionDialog(val) {
      val || this.close();
    },
    subscriptionDialogDelete(val) {
      val || this.closeDelete();
    },
  },

  //When component is rendered, checks for auth in storage
  created() {
    this.initialize();
  },

  methods: {
    //Initializes table
    initialize() {
      this.getAppList();
      this.getPlans();
    },

    editItem(item) {
      console.log(item);
      this.editedIndex = this.applist.indexOf(item);
      this.editedItem = Object.assign({}, item);

      this.selected = item.id;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.applist.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.selected = item.id;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteAppList(this.selected);
      this.applist.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;

      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeSubscription() {
      this.subscriptionDialog = false;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.applist[this.editedIndex], this.editedItem);
        this.overlay = true;
        this.updateAppList(this.editedItem.id);
      } else {
        this.overlay = true;

        this.applist.push(this.editedItem);

        this.addAppList();
      }
      this.close();
    },

    getAppList() {
      axios
        .request({
          url: "https://hiring-example-25770.botics.co/api/v1/apps/",
          method: "get",
          // data: reqData,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem("ApiKey")}`,
          },
        })
        .then((res) => {
          if (res.data.length == 0) {
            this.loading = false;
          }

          for (let app in res.data) {
            this.applist.push(res.data[app]);
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err.response);
          this.text = "An error has occured retrieving applist.";
          this.color = "error";
          this.snackbar = true;
        });
    },

    addAppList() {
      axios
        .request({
          url: `https://hiring-example-25770.botics.co/api/v1/apps/`,
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem("ApiKey")}`,
          },
          data: {
            name: this.editedItem.name,
            description: this.editedItem.description,
            type: "Web",
            framework: "Django",
            domain_name: "testdomain",
          },
        })
        .then((res) => {
          this.overlay = false;
          console.log(res);

          this.text = "Successfully added a new App!";
          this.color = "success";
          this.snackbar = true;
        })
        .catch((err) => {
          console.log(err.response);
          this.text = "An error has occured adding or updating the App.";
          this.color = "error";
          this.snackbar = true;
        });
    },

    updateAppList(id) {
      axios
        .request({
          url: `https://hiring-example-25770.botics.co/api/v1/apps/${id}`,
          method: "put",
          headers: {
            Authorization: `Token ${localStorage.getItem("ApiKey")}`,
          },

          data: {
            name: this.editedItem.name,
            description: this.editedItem.description,
            type: "Web",
            framework: "Django",
            domain_name: "testdomain",
          },
        })
        .then((res) => {
          this.overlay = false;
          console.log(res);
          this.text = "Successfully added a new App!";
          this.color = "success";
          this.snackbar = true;
        })
        .catch((err) => {
          console.log(err.response);
          this.text = "An error has occured adding or updating the App.";
          this.color = "error";
          this.snackbar = true;
        });
    },

    updatePlan(item) {
      // console.log(item);
      this.currentPlan = item;
      this.subscriptionDialog = true;
      console.log(this.currentPlan);
      // this.$emit("updateDialog", item); //Triggers dialog on dashboard as it's the parent
    },

    deleteAppList(id) {
      axios
        .request({
          url: `https://hiring-example-25770.botics.co/api/v1/apps/${id}`,
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("ApiKey")}`,
          },
        })
        .then((res) => {
          this.overlay = false;
          console.log(res);
          this.text = "App deleted!";
          this.color = "success";
          this.snackbar = true;
        })
        .catch((err) => {
          console.log(err.response);
          this.text = "An error has occured adding or updating the App.";
          this.color = "error";
          this.snackbar = true;
        });
    },

    getPlans() {
      axios
        .request({
          url: `https://hiring-example-25770.botics.co/api/v1/plans/`,
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("ApiKey")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.plans = res.data;
        })
        .catch((err) => console.log(err.response));
    },
  },
};
</script>

<style scoped>
.adduser {
  margin: 2em;
}

.row {
  margin: 2em;
}
</style>
