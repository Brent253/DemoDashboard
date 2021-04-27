import Vue from "vue";
import VueRouter from "vue-router";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import ResetPassword from "./components/ResetPassword";
import ChangePassword from "./components/ChangePassword";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    // {
    //   path: "*",
    //   redirect: "/",
    // },
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/resetpassword",
      name: "ResetPassword",
      component: ResetPassword,
    },
    {
      path: "/changepassword",
      name: "ChangePassword",
      component: ChangePassword,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  // ...
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const user = localStorage.getItem("ApiKey");
  if (requiresAuth && !user) {
    //redirect to login
    next("/");
  } else {
    next();
  }
});

export default router;
