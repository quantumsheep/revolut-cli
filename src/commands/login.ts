import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import moment from 'moment';
import ora from 'ora';
import * as config from '../config';
import * as revolut from '../revolut';
import { TokenDTO } from '../revolut';
import { sleep } from '../utils';

export const command = new Command('login');

interface Credentials {
  phone: string;
  password: string;
}

const PHONE_REGEX = /^\+(?:[0-9]●?){6,14}[0-9]$/;

command.action(async () => {
  const { phone, password } = await inquirer.prompt<Credentials>([
    {
      name: 'phone',
      type: 'input',
      message: 'What is your phone number?',
      prefix: '📞',
      validate: (phone: string) => {
        if (PHONE_REGEX.test(phone)) {
          return true
        }

        return 'Invalid phone number';
      },
    },
    {
      name: 'password',
      type: 'password',
      message: 'What is your Revolut password?',
      prefix: '🔒',
    },
  ]);

  const { tokenId } = await revolut.signin(phone, password);

  console.log(`Revolut sent a notification to ${phone} to authenticate your log in.`);
  console.log('Please make sure your Revolut app is up to date (version 7.23 or later).');
  console.log('');

  const spinner = ora(`Awaiting for app authentication... (10.00)`).start();

  let seconds = 10 * 60 * 1000;

  const interval = setInterval(() => {
    seconds -= 1000;
    spinner.text = `Awaiting for app authentication... (${moment(seconds).format('mm:ss')})`;
  }, 1000);

  const stopSpinner = () => {
    spinner.stop();
    clearInterval(interval);
  }

  const check = async (): Promise<TokenDTO> => {
    try {
      const data = await revolut.token(phone, password, tokenId);
      stopSpinner();

      return data;
    } catch (e) {
      if (seconds <= 0) {
        stopSpinner();
        throw 'Failed to authenticate';
      }

      await sleep(3000);
      return check();
    }
  }

  const data = await check();

  await config.setObject(data);

  console.log(chalk.green('Successfully logged in'))
});
