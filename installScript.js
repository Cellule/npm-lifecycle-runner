var lifecycleRunner = require("./index");

lifecycleRunner(__dirname, [
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
