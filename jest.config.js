const { defaults } = require("jest-config");
module.exports = {
  verbose: true,
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    "ts",
    "tsx",
    "vue",
    "js",
    "json",
  ],

  setupFiles: ["./setup.js"],

  collectCoverage: true,
  collectCoverageFrom: ["**/*.{js,vue}", "!**/node_modules/**"],

  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^[^.]+.vue$": "vue-jest",
  },

  devDependencies: {
    "babel-core": "^7.0.0-bridge.0",
  },
};
