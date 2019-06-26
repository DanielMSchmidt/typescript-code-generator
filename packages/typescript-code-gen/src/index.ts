import yargs from "yargs";
import createProjectConfig from "./projectConfig";
import runCodeGeneration from "./codeGeneration";
yargs
  .command("init", "Create project config", yargs => yargs, createProjectConfig)
  .command({
    command: "run",
    aliases: "*",
    describe: "Runs the code generation",
    handler: runCodeGeneration
  })
  .demandCommand()
  .help().argv;
