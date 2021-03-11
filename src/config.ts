import { promises as fs } from 'fs';
import { homedir } from 'os';
import path from 'path';
import { v4 as uuid } from 'uuid';

export let CONFIG_FILEPATH = path.resolve(homedir(), '.revolut');

export function setConfigFilePath(path: string) {
  CONFIG_FILEPATH = path;
}

export interface Config {
  deviceId: string;
  accessToken?: string;
  tokenExpiryDate?: number;
  user?: {
    id: string;
    state: string;
  };
}

let config: Config = null;

async function exists() {
  try {
    await fs.access(CONFIG_FILEPATH);
    return true;
  } catch {
    return false;
  }
}

function encode() {
  return Buffer.from(JSON.stringify(config)).toString('base64');
}

function decode(data: string) {
  return JSON.parse(Buffer.from(data, 'base64').toString());
}

async function load() {
  if (config) return;

  if (await exists()) {
    const data = await fs.readFile(CONFIG_FILEPATH, { encoding: 'utf-8' });
    config = decode(data);
  } else {
    config = {
      deviceId: uuid(),
    };

    await save();
  }
}

export async function save() {
  await load();
  await fs.writeFile(CONFIG_FILEPATH, encode());
}

export async function set<K extends keyof Config>(name: K, value: Config[K]) {
  await load();

  config[name] = value;
  await save();
}

export async function setObject(obj: Partial<Config>) {
  await load();

  config = {
    ...config,
    ...obj,
  };

  await save();
}

export async function get<K extends keyof Config>(name: K) {
  await load();
  return config[name];
}
