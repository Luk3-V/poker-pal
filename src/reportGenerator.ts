import * as parser from '@poker-apprentice/hand-history-parser';
import BigNumber from 'bignumber.js';
import { HandData, SummaryReport } from './types';
import { getHeroNamePosition } from './handParser';

export function getSummaryReport(handData: HandData[]): SummaryReport {
  let statsSummary: SummaryReport = {
    totalHands: 0,
    totalWinnings: 0,
    totalRake: 0,
    bb100: 0,
    vpip: 0,
    pfr: 0,
    rfi: 0,
    threeBetPF: 0,
    fourBetPF: 0,
    raiseFoldVs3bet: 0,
    threeBetFoldVs4bet: 0,
    st: 0,
    fvst: 0,
    preShowdownHands: 0,
    postShowdownHands: 0,
    bb100PreShowdown: 0,
    bb100PostShowdown: 0,
    handsByPosition: {
      "SB": 0,
      "BB": 0,
      "UTG": 0,
      "UTG+1": 0,
      "MP": 0,
      "LJ": 0,
      "HJ": 0,
      "CO": 0,
      "BTN": 0,
    },
    bb100ByPosition: {
      "SB": 0,
      "BB": 0,
      "UTG": 0,
      "UTG+1": 0,
      "MP": 0,
      "LJ": 0,
      "HJ": 0,
      "CO": 0,
      "BTN": 0,
    },
  };

  for (const data of handData) {
    const { name: heroName, position: heroPosition } = getHeroNamePosition(data.handHistory);

    // Count hands by position
    statsSummary.handsByPosition[heroPosition]++;
    
    // Track hero stats
    if (data.handStats.players[heroName]) {
      statsSummary.totalHands++;
      statsSummary.totalWinnings += parseFloat(data.handStats.players[heroName].totalWon);
      statsSummary.totalRake += parseFloat(data.handStats.players[heroName].totalRakeContributed);
      statsSummary.vpip += data.handStats.players[heroName].vpip ? 1 : 0;
      // Track hero preflop stats
      if (data.handStats.players[heroName].streets["preflop"]) {
        statsSummary.pfr += data.handStats.players[heroName].streets["preflop"].raiseCount > 0 ? 1 : 0;
        statsSummary.rfi += data.handStats.players[heroName].streets["preflop"].bets["2"] ? 1 : 0;
        statsSummary.threeBetPF += data.handStats.players[heroName].streets["preflop"].bets["3"] ? 1 : 0;
        statsSummary.fourBetPF += data.handStats.players[heroName].streets["preflop"].bets["4"] ? 1 : 0;
        statsSummary.st += heroPosition === "BTN" && data.handStats.players[heroName].streets["preflop"].raiseCount > 0 ? 1 : 0;
      }
    }
    
    // Track BB100 by position
    statsSummary.bb100ByPosition[heroPosition] += parseFloat(data.handStats.players[heroName].totalWon) / parseFloat(data.handHistory.info.blinds[data.handHistory.info.blinds.length - 1]);

    // Track BB100 stats
    statsSummary.bb100 += parseFloat(data.handStats.players[heroName].totalWon) / parseFloat(data.handHistory.info.blinds[data.handHistory.info.blinds.length - 1]);
    if (data.handStats.players[heroName].wentToShowdown) {
      statsSummary.postShowdownHands++;
      statsSummary.bb100PostShowdown += parseFloat(data.handStats.players[heroName].totalWon) / parseFloat(data.handHistory.info.blinds[data.handHistory.info.blinds.length - 1]);
    } else {
      statsSummary.preShowdownHands++;
      statsSummary.bb100PreShowdown += parseFloat(data.handStats.players[heroName].totalWon) / parseFloat(data.handHistory.info.blinds[data.handHistory.info.blinds.length - 1]);
    }
  }

  statsSummary.bb100 = statsSummary.bb100 / handData.length * 100;
  statsSummary.bb100PreShowdown = statsSummary.bb100PreShowdown / statsSummary.preShowdownHands * 100;
  statsSummary.bb100PostShowdown = statsSummary.bb100PostShowdown / statsSummary.postShowdownHands * 100;
  
  for (const position in statsSummary.bb100ByPosition) {
    statsSummary.bb100ByPosition[position as parser.Position] = statsSummary.bb100ByPosition[position as parser.Position] / statsSummary.handsByPosition[position as parser.Position] * 100;
  }

  statsSummary.vpip = statsSummary.vpip / handData.length;
  statsSummary.pfr = statsSummary.pfr / handData.length;
  statsSummary.rfi = statsSummary.rfi / handData.length;
  statsSummary.threeBetPF = statsSummary.threeBetPF / handData.length;
  statsSummary.fourBetPF = statsSummary.fourBetPF / handData.length;
  statsSummary.st = statsSummary.st / statsSummary.handsByPosition["BTN"];

  return statsSummary;
}

export function printReport(report: SummaryReport) {
  console.log('='.repeat(30));
  console.log(`Total Hands: ${report.totalHands}`);
  console.log(`Total Winnings: $${BigNumber(report.totalWinnings).toFixed(2)}`);
  console.log(`Total Rake: $${BigNumber(report.totalRake).toFixed(2)}`);
  console.log('='.repeat(30));
  console.log(`BB100: ${BigNumber(report.bb100).toFixed(2)}`);
  console.log(`BB100 Pre Showdown: ${BigNumber(report.bb100PreShowdown).toFixed(2)} (${report.preShowdownHands} hands)`);
  console.log(`BB100 Post Showdown: ${BigNumber(report.bb100PostShowdown).toFixed(2)} (${report.postShowdownHands} hands)`);
  for (const position in report.bb100ByPosition) {
    if (position === "UTG+1" || position === "HJ" || position === "LJ") continue; // Skip 9-max only positions
    console.log(`BB100 as ${position}: ${BigNumber(report.bb100ByPosition[position as parser.Position]).toFixed(2)} (${report.handsByPosition[position as parser.Position]} hands)`);
  }
  console.log('='.repeat(30));
  console.log(`VPIP: ${BigNumber(report.vpip).multipliedBy(100).toFixed(2)}%`);
  console.log(`PFR: ${BigNumber(report.pfr).multipliedBy(100).toFixed(2)}%`);
  console.log(`RFI: ${BigNumber(report.rfi).multipliedBy(100).toFixed(2)}%`);
  console.log(`3bet PF: ${BigNumber(report.threeBetPF).multipliedBy(100).toFixed(2)}%`);
  console.log(`4bet PF: ${BigNumber(report.fourBetPF).multipliedBy(100).toFixed(2)}%`);
  console.log(`Steal: ${BigNumber(report.st).multipliedBy(100).toFixed(2)}%`);
  console.log('='.repeat(30));
}