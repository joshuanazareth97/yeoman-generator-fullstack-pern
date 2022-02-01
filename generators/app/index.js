"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");
const { exec } = require("child_process");

const execAsync = command =>
  new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) reject(err);
      if (stderr) reject(stderr);
      if (stdout) resolve(stdout);
    });
  });

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the ${chalk.red("PERN fullstack")} generator!`));
    const un = await execAsync("git config --get user.name");
    const email = await execAsync("git config --get user.email");
    const prompts = [
      {
        type: "string",
        name: "projectName",
        message: "What is the name of the project?",
        required: true
      },
      {
        type: "string",
        name: "projectDescription",
        message: "Briefly describe it:",
        required: true,
        default:
          "A dockerised full stack application using PgSQL, Express and React."
      },
      {
        type: "string",
        name: "author",
        message: "Who is the author of this project?",
        required: true,
        default: un.trim()
      },
      {
        type: "string",
        name: "email",
        message: "What is their email address?",
        required: true,
        default: email.trim()
      },
      {
        type: "confirm",
        name: "enableRedis",
        message: "Would you like to enable Redis?",
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.log(props);
    });
  }

  _generateFiles(source, destination) {
    const files = glob.sync(`${this.templatePath(source)}/**`, { dot: true });
    for (let file of files) {
      const fileStub = file
        .replace(this.templatePath(source), "")
        .replace("/", "");
      if (fileStub) {
        if (destination) {
          this.fs.copyTpl(
            file,
            this.destinationPath(
              `${destination}.${this.props.projectName}`,
              fileStub
            ),
            this.props
          );
        } else {
          this.log(this.destinationPath(fileStub));
          this.fs.copyTpl(file, this.destinationPath(fileStub), this.props);
        }
      }
    }
  }

  writing() {
    this._generateFiles("frontend", "frontend");
    this._generateFiles("base", "");
  }

  install() {
    this.spawnCommand("git", ["init"]);
    this.spawnCommand("npm", ["run", "install_subpackages"]);
  }

  end() {
    this.log(
      yosay(`${chalk.blue("Happy hacking!")}
    \nrun \`docker-compose up\` to check if everythinng was set up correctly. 
    `)
    );
  }
};
