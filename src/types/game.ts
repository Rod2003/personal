export type TicTacToeState = {
  board: string[];
  currentPlayer: 'X' | 'O';
  gameOver: boolean;
  winner: string | null;
};

export type NumberGameState = {
  targetNumber: number;
  triesLeft: number;
  gameOver: boolean;
};

export type GameContextType = {
  currentGame: string | null;
  ticTacToe: TicTacToeState;
  numberGame: NumberGameState;
  updateTicTacToe: (position: number) => string;
  updateNumberGame: (guess: number) => string;
  startGame: (game: string) => void;
  exitGame: () => void;
};
