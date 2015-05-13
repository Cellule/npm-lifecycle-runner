var argv = process.argv;
if(argv.length > 2 && argv[2] === "--debug") {
  process.env.npm_lifecycle_event = "install";
  var lifecycleRunner = require("./index");
  __RUNNER_DEBUG__ = true;
} else {
  var lifecycleRunner = require("./index");
}

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
