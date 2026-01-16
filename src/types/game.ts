// Game-related types
export interface TicTacToeState {
  board: string[];
  currentPlayer: 'X' | 'O';
  gameOver: boolean;
  winner: string | null;
}

export interface NumberGameState {
  targetNumber: number;
  triesLeft: number;
  gameOver: boolean;
}

export interface GameContextType {
  currentGame: string | null;
  ticTacToe: TicTacToeState;
  numberGame: NumberGameState;
  updateTicTacToe: (position: number) => string;
  updateNumberGame: (guess: number) => string;
  startGame: (game: string) => void;
  exitGame: () => void;
}
