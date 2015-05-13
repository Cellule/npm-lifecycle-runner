process.env.npm_lifecycle_event = "install"
var lifecycleRunner = require("./index");

lifecycleRunner(__dirname, [
  "echo running devInstall",
  {
    type: "devInstall",
    cmd: "eslint-myrules cp",
    onSuccess: "Successfully copied eslint rules"
  },
  {
    type: "prodInstall",
    cmd: "echo check https://github.com/Cellule/npm-lifecycle-runner for details"
  },

]);
