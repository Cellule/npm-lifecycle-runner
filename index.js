var exec = require("child_process").exec;
var path = require("path");

var isProd = process.env.NODE_ENV === "production";
var lifecycleEvent = process.env.npm_lifecycle_event;

/*
var supportedLifeCycles = [
  // only when installing in its own folder `npm install`
  "devInstall",
  // when installing for production or from another module
  "prodInstall",
  // on every install lifecycle event
  "install",
];
*/
var defaultLifeCycle = "devInstall";

// TODO:: add support for other lifecycles
var lifeCycles = [
  function isDevInstall(projectRoot) {
    if(
      !isProd &&
      lifecycleEvent === "install" &&
      path.dirname(projectRoot) !== "node_modules"
    ) {
      return "devInstall";
    }
  },
  function isProdInstall(projectRoot) {
    if(
      lifecycleEvent === "install" &&
      (
        isProd ||
        // installed from another module
        path.dirname(projectRoot) === "node_modules"
      )
    ) {
      return "prodInstall";
    }
  },
  function isInstall() {
    if(lifecycleEvent === "install") {
      return "install";
    }
  }
];

function report(msg) {
  console.warn("npm-lifecycle-runner: " + msg);
}

function execCmd(cmdDetails, done) {
  var cmd;
  var opts = cmdDetails.opts || process;
  if(typeof cmdDetails === "string") {
    cmd = cmdDetails;
    opts = process;
  } else {
    cmd = cmdDetails.cmd;
  }
  if(!cmd) {
    report("Empty cmd");
    return done();
  }

  // console.log("> " + cmd);
  exec(cmd, opts, function (err, stdout, stderror) {
    if(err) {
      if(cmdDetails.onError) {
        cmdDetails.onError(err, stdout, stderror);
        return done();
      }
      console.error(stderror);
      return done();
    }

    if(cmdDetails.onSuccess) {
      if(typeof cmdDetails.onSuccess === "string") {
        console.log(cmdDetails.onSuccess);
      } else {
        cmdDetails.onSuccess(stdout, stderror);
      }
      return done();
    }
    console.log(stdout);
    return done();
  });
}

module.exports = function(projectRoot, cmds) {
  if(typeof projectRoot !== "string") {
    return report("projectRoot missing or is not a string");
  }
  if(!cmds) {
    return report("commands missing");
  }
  if(typeof cmds !== "object" || !Array.isArray(cmds)) {
    cmds = [cmds];
  }

  var type;
  for(var i = 0; i < lifeCycles.length && !type; i++) {
    type = lifeCycles[i](projectRoot);
  }

  if(!type) {
    return report("Unsupported lifecycle event");
  }

  cmds = cmds.map(function(cmd) {
    var result = cmd || {};
    if(typeof cmd === "string") {
      result = {
        type: defaultLifeCycle,
        cmd: cmd
      };
    }
    result.type = result.type || defaultLifeCycle;
    return result;
  });

  function run(cmdDetails, next) {
    return function() {
      process.nextTick(function() {
        if(type === cmdDetails.type) {
          return execCmd(cmdDetails, next);
        }
        next();
      });
    };
  }

  var nextCallback = function() { };
  for(var i = cmds.length - 1; i >= 0; i--) {
    var cmd = cmds[i];
    cmd.run = run(cmd, nextCallback);
    nextCallback = cmd.run;
  }
  cmds[0].run();
};
