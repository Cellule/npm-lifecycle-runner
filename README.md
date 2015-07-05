# npm-lifecycle-runner

## Description
The main purpose of this module is to run install scripts only when developping or in production.
It also supports every other lifecycle.

Sometimes, in your project, you run `npm install` to get your modules. You also want to run some command to get setup for development. However, if you setup an install script
```js
{
  "scripts": {
    "install": "somecommand"
  }
}
```
This command will get run also whenever anyone installs your module or when you have `NODE_ENV=production`.

## Installation
```
$ npm install npm-lifecycle-runner
```

## Usage
Create a file in the root of your project to run your installation script, ie: `installScript.js`.

Then you can require `npm-lifecycle-runner` and call it with the path to the root of your project, ie: `__dirname` and a list of commands you want to run.

For instance
```js
var lifecycleRunner = require("npm-lifecycle-runner");

lifecycleRunner(__dirname, [
  {
    type: "devInstall",
    cmd: "echo You are now setup to develop"
  },
  {
    type: "prodInstall",
    cmd: "echo check https://github.com/Cellule/npm-lifecycle-runner for details"
  },
]);
```

Then add in your `package.json`
```js
{
  "scripts": {
    "install": "node installScript.js"
  }
}
```

## Api

- `require("npm-lifecycle-runner")`: function(projectRoot, cmdsList)
  - `projectRoot`: String, path to the root of your project
  - `cmdsList`: Command | Command[], list of commands to execute
- `Command`: String | {
    type?: String,
    cmd: String,
    onSuccess?: String | function(stdout, stderror) => void
    onError?: function(err, stdout, stderror) => void
  }, The command to run. If the command is a string it reprensents the command to run.
  - PossibleTypes: Optional. Default: "devInstall"
    - "devInstall": Runs the script when installing modules while developping, `devDependencies` will be available.
    - "prodInstall": Runs the script when installing for production or when another module install your module, `devDependencies` will be unavailable
    - "install": Runs the script on install regardless of development or production. Acts exactly like putting your command in the `package.json`
    - Every other npm lifecycle commands
  - `onSuccess`: Optional. If it's a string, it will output it if the command succeed. If it's a function, it will be called back with the output of the command.
  - `onError`: Optional. Callback with the error message and the output of the command. If this is missing, it will simply output the `stderror` in the console.
- `getLifecycle`: function(projectRoot) => lifecycle. Exposed method to get the current lifecycle. Use `require("npm-lifecycle-runner").getLifecycle(process.cwd())`
