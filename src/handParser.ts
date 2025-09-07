import * as fs from 'fs';
import * as path from 'path';
import * as parser from '@poker-apprentice/hand-history-parser';
import { splitIntoHands } from './fileUtils';

export async function parseHandHistoryFile(filePath: string): Promise<parser.HandHistory[]> {
  try {    
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    const hands = splitIntoHands(content);
    console.log(`Found ${hands.length} hand(s) in ${filename}`);
    
    let successfulParses = 0;
    let failedParses = 0; 
    let handHistories: parser.HandHistory[] = [];
    
    for (let i = 0; i < hands.length; i++) {
      const handText = hands[i];
      if (handText.trim().length === 0) continue;
      
      try {
        const handHistory = await parser.parseHand({ hand: handText, filename });
        
        if (handHistory) {
          successfulParses++;
          handHistories.push(handHistory);
        }
      } catch (handError) {
        console.log(`✗ Hand ${i + 1} failed to parse: ${handError instanceof Error ? handError.message : String(handError)}`);
        failedParses++;
      }
    }
    
    console.log(`Parsing Summary: ${successfulParses} successful, ${failedParses} failed`);
    return handHistories;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

export function getHeroNamePosition(handHistory: parser.HandHistory): { name: string, position: parser.Position } {
  const hero = handHistory.players.find(player => player.isHero);
  if (!hero) {
    throw new Error("No hero found in hand history");
  }
  return { name: hero.name, position: hero.position };
}
