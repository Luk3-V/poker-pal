import * as fs from 'fs';
import * as path from 'path';

export function getHandHistoryFiles(directory: string, extensions: string[]): string[] {
  try {
    if (!fs.existsSync(directory)) {
      console.log(`Directory ${directory} does not exist.`);
      return [];
    }

    const files = fs.readdirSync(directory);
    return files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return extensions.includes(ext);
      })
      .map(file => path.join(directory, file));
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

export function splitIntoHands(content: string): string[] {
  // Normalize line endings
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split by "Ignition Hand #" and filter out empty strings
  // @TODO: Implement a more dynamic way to split the hands
  const hands = normalizedContent.split(/Ignition Hand #/g)
    .map(hand => hand.trim())
    .filter(hand => hand.length > 0)
    .map(hand => `Ignition Hand #${hand}`); // Add back the prefix that was removed by split
  
  return hands;
}
