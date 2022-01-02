"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

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
        message: "What is the name of the project?"
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

  writing() {
    this.fs.copyTpl(
      this.templatePath("react-frontend/**"),
      this.destinationPath(`frontend.${this.props.projectName}`),
      this.props
    );
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false
    });
  }
  end() {
    this.log(yosay(chalk.blue(`Happy hacking!`)));
  }
};
