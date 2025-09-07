import * as fs from 'fs';
import * as path from 'path';
import { Config } from './types';

export function loadConfig(): Config {
  try {
    const configPath = path.join(process.cwd(), 'config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error loading config.json:', error);
    process.exit(1);
  }
}
