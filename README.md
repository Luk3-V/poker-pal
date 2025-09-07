# Poker Pal - Hand History Parser

A simple TypeScript application that uses the `@poker-apprentice/hand-history-parser` library to parse poker hand history files & `@poker-apprentice/hand-history-analyzer` to analayze specific stats.

## Features

- Automatically scans the configured directory for hand history files
- Parses each file and generates basic reports

## Configuration

Edit `config.json` to change:
- `handHistoryDirectory`: Path to your hand history files
- `supportedExtensions`: File extensions to look for
