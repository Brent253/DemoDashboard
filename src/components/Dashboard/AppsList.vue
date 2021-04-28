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
                    @subscribed="notify"
                  />
                </v-container>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" top>
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
  </div>
</template>

<script>
import ChangePlan from "./ChangePlan";
const axios = require("axios");
export default {
  name: "Login",

  data: () => ({
    //Notifications
    snackbar: false,
    text: "",
    color: "success",
    timeout: 3000,

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
        //Basic field validation
        if (this.editedItem.name != "" && this.editedItem.description != "") {
          Object.assign(this.applist[this.editedIndex], this.editedItem);
          this.overlay = true;
          this.updateAppList(this.editedItem.id);
        } else {
          this.notify("invalid");
        }
      } else {
        //Basic field validation
        if (this.editedItem.name != "" && this.editedItem.description != "") {
          this.overlay = true;

          this.applist.push(this.editedItem);

          this.addAppList();
        } else {
          this.notify("invalid");
        }
      }
      this.close();
    },

    getAppList() {
      axios
        .request({
          url: `${process.env.VUE_APP_APPLIST}`,
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
          this.notify("error");
        });
    },

    addAppList() {
      axios
        .request({
          url: `${process.env.VUE_APP_APPLIST}`,
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
          //We need to refetch the table to get the valid subscription without reloading.
          this.applist = [];
          this.plans = [];
          this.initialize();

          this.overlay = false;
          console.log(res);

          this.notify("add");
        })
        .catch((err) => {
          console.log(err.response);
          this.notify("error");
        });
    },

    updateAppList(id) {
      axios
        .request({
          url: `${process.env.VUE_APP_APPLIST}${id}`,
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
          this.notify("update");
        })
        .catch((err) => {
          console.log(err.response);
          this.notify("error");
        });
    },

    updatePlan(item) {
      this.currentPlan = item;

      this.subscriptionDialog = true;
      console.log(this.currentPlan);
    },

    deleteAppList(id) {
      axios
        .request({
          url: `${process.env.VUE_APP_APPLIST}${id}`,
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("ApiKey")}`,
          },
        })
        .then((res) => {
          this.overlay = false;
          console.log(res);

          this.notify("delete");
        })
        .catch((err) => {
          console.log(err.response);
          this.notify("error");
        });
    },

    getPlans() {
      axios
        .request({
          url: `${process.env.VUE_APP_PLANS}`,
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("ApiKey")}`,
          },
        })
        .then((res) => {
          this.plans = res.data;
        })
        .catch((err) => console.log(err.response));
    },

    notify(message) {
      switch (message) {
        case "add":
          // code block
          this.text = "Successfully added a new App!";
          this.snackbar = true;
          this.color = "success";
          break;
        case "update":
          // code block
          this.text = "App successfully updated!";
          this.color = "success";
          this.snackbar = true;
          break;

        case "delete":
          //codeblock
          this.text = "Your app has been deleted.";
          this.color = "success";
          this.snackbar = true;
          break;
        case "subscribed":
          // code block
          this.text = "Your subscription has been updated!";
          this.snackbar = true;
          this.color = "success";
          break;
        case "error":
          //error on http request
          this.text = "An error has occured updating the app";
          this.color = "error";
          this.snackbar = true;
          break;
        case "invalid":
          this.text =
            "An error has occured. Please enter a valid name and description";
          this.color = "error";
          this.snackbar = true;
          break;
        default:
        // code block
      }
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
