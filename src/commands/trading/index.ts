import { Command } from 'commander';
import { command as portfolioCommand } from './portfolio';

export const command = new Command('trading');

command.addCommand(portfolioCommand);
