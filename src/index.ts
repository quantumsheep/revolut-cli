#!/usr/bin/env node --no-warnings

import { Command } from 'commander';
import commands from './commands';
import * as config from './config';

const pkg = require('../package.json');

const program = new Command()
  .version(pkg.version)
  .description(pkg.description)
  .option('-c, --config <path>', 'configuration file path', config.CONFIG_FILEPATH)
  .on('option:config', (path) => {
    config.setConfigFilePath(path);
  });

for (const command of commands) {
  program.addCommand(command);
}

program.parse(process.argv);
