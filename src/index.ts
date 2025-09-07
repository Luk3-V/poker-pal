import { loadConfig } from './configLoader';
import { getHandHistoryFiles } from './fileUtils';
import { parseHandHistoryFile } from './handParser';
import { analyzeHandHistories } from './handAnalyzer';
import { getSummaryReport, printReport } from './reportGenerator';

async function main(): Promise<void> {
  console.log('PokerPal Hand History Parser');
  console.log('='.repeat(30));
  
  const config = loadConfig();
  const files = getHandHistoryFiles(config.handHistoryDirectory, config.supportedExtensions);
  
  if (files.length === 0) {
    console.log(`No hand history files found in ${config.handHistoryDirectory}.`);
    return;
  }
  console.log(`Found ${files.length} hand history file(s) in ${config.handHistoryDirectory}.`);
  
  const handHistoriesMatrix = await Promise.all(files.map(parseHandHistoryFile));
  const handHistories = handHistoriesMatrix.flat();

  const handStats = analyzeHandHistories(handHistories);
  const combinedHandData = handHistories.map((handHistory, index) => ({
    handHistory: handHistory,
    handStats: handStats[index]
  }));

  const summaryReport = getSummaryReport(combinedHandData);
  printReport(summaryReport);
}

if (require.main === module) {
  main();
} 

// @TODO: Are sat out hands included in the history files or stats?

// @TODO: Features to add:
// - Add debug mode
// - Add colors & formatting to report.
// - Add raise/fold vs 3bet, 3bet/fold vs 4bet, FvST
// - Add way to filter hands by position, stakes, hold cards, or date range.
// - Add way to group report by position, stakes, hold cards, or day/week/month.
// - Add handsByStreet.