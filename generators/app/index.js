"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the ${chalk.red("PERN fullstack")} generator!`));

    const prompts = [
      {
        type: "string",
        name: "projectName",
        message: "What is the name of the project?"
      },
      {
        type: "string",
        name: "projectDescription",
        message: "Briefly describe it:",
        default: process.env.npm_package_description
      },
      {
        type: "string",
        name: "author",
        message: "Who is the author of this project?",
        default: "Joshua"
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
    });
  }

  _generateFiles(source, destination) {
    const files = glob.sync(`${this.templatePath(source)}/**`, { dot: true });
    for (let file of files) {
      const fileStub = file.replace(this.templatePath(source), "");
      if (fileStub) {
        this.fs.copyTpl(
          file,
          this.destinationPath(
            `${destination}.${this.props.projectName}`,
            fileStub
          ),
          this.props
        );
      }
    }
  }

  writing() {
    this._generateFiles("frontend", "frontend");
    this._generateFiles("base", "");
  }

  install() {}

  end() {
    this.spawnCommand("git", ["init"]);
    this.log(
      yosay(`${chalk.blue("Happy hacking!")}
    \nrun \`docker-compose up\` to check if everythinng was set up correctly. 
    `)
    );
  }
};
