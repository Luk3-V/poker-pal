/**
 * Configuration interface for the PokerPal application
 * Defines the settings needed to locate and process hand history files
 */
export interface Config {
  /** Directory path where hand history files are stored */
  handHistoryDirectory: string;
  /** Array of file extensions to process (e.g., ['.txt', '.log']) */
  supportedExtensions: string[];
}

/**
 * Combined hand data containing both parsed hand history and analyzed statistics
 * This structure pairs the raw parsed data with computed analytics for each hand
 */
export interface HandData {
  /** Parsed hand history from the poker hand history parser */
  handHistory: import('@poker-apprentice/hand-history-parser').HandHistory;
  /** Computed statistics and analysis for the hand */
  handStats: import('@poker-apprentice/hand-history-analyzer').HandHistoryStats;
}

/**
 * Comprehensive summary report containing aggregated poker statistics
 * Provides an overview of performance across all analyzed hands
 */
export interface SummaryReport {
  /** Total number of hands analyzed */
  totalHands: number;
  /** Total winnings across all hands (in dollars) */
  totalWinnings: number;
  /** Total rake paid across all hands (in dollars) */
  totalRake: number;
  /** Big blinds won per 100 hands (BB/100) - key profitability metric */
  bb100: number;
  /** Voluntarily Put Money In Pot percentage (0-1 scale) */
  vpip: number;
  /** Pre-Flop Raise percentage (0-1 scale) */
  pfr: number;
  /** Raise First In percentage (0-1 scale) */
  rfi: number;
  /** Three-bet pre-flop percentage (0-1 scale) */
  threeBetPF: number;
  /** Four-bet pre-flop percentage (0-1 scale) */
  fourBetPF: number;
  /** Raise/Fold vs 3-bet percentage (0-1 scale) */
  raiseFoldVs3bet: number;
  /** Three-bet/Fold vs 4-bet percentage (0-1 scale) */
  threeBetFoldVs4bet: number;
  /** Steal percentage from button position (0-1 scale) */
  st: number;
  /** Fold vs Steal percentage (0-1 scale) */
  fvst: number;
  /** Number of hands that didn't reach showdown */
  preShowdownHands: number;
  /** Number of hands that reached showdown */
  postShowdownHands: number;
  /** BB/100 for hands that didn't reach showdown */
  bb100PreShowdown: number;
  /** BB/100 for hands that reached showdown */
  bb100PostShowdown: number;
  /** Number of hands played in each position */
  handsByPosition: Record<import('@poker-apprentice/hand-history-parser').Position, number>;
  /** BB/100 performance in each position */
  bb100ByPosition: Record<import('@poker-apprentice/hand-history-parser').Position, number>;
}
