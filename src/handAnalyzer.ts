import * as parser from '@poker-apprentice/hand-history-parser';
import * as analyzer from '@poker-apprentice/hand-history-analyzer';

export function analyzeHandHistories(handHistories: parser.HandHistory[]): analyzer.HandHistoryStats[] {
  console.log(`Analyzing ${handHistories.length} hand(s)...`);
  
  let successfulAnalysis = 0;
  let failedAnalysis = 0;
  let analysisResults: analyzer.HandHistoryStats[] = [];
  
  for (let i = 0; i < handHistories.length; i++) {
    const handHistory = handHistories[i];
    
    try {
      const analysis = analyzer.analyzeHand(handHistory);
      analysisResults.push(analysis);
      successfulAnalysis++;
    } catch (analysisError) {
      console.log(`✗ Hand ${i + 1} failed to analyze: ${analysisError instanceof Error ? analysisError.message : String(analysisError)}`);
      failedAnalysis++;
    }
  }
  
  console.log(`Analysis Summary: ${successfulAnalysis} successful, ${failedAnalysis} failed`);
  return analysisResults;
}
