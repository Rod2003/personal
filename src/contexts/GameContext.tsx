import React, { createContext, useContext, useState } from 'react';

interface TicTacToeState {
  board: string[];
  currentPlayer: 'X' | 'O';
  gameOver: boolean;
  winner: string | null;
}

interface NumberGameState {
  targetNumber: number;
  triesLeft: number;
  gameOver: boolean;
}

interface GameContextType {
  currentGame: string | null;
  ticTacToe: TicTacToeState;
  numberGame: NumberGameState;
  updateTicTacToe: (position: number) => string;
  updateNumberGame: (guess: number) => string;
  startGame: (game: string) => void;
  exitGame: () => void;
}

// Helper function to check for winner
const checkWinner = (board: string[]): string | null => {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every(cell => cell !== '')) return 'tie';
  return null;
};

// Helper function to format the board
const formatBoard = (board: string[]): string => {
  let display = '\n';
  for (let i = 0; i < 9; i += 3) {
    display += ` ${board[i] || ' '} │ ${board[i + 1] || ' '} │ ${board[i + 2] || ' '} \n`;
    if (i < 6) display += '───┼───┼───\n';
  }
  return display;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  
  const [ticTacToe, setTicTacToe] = useState<TicTacToeState>({
    board: Array(9).fill(''),
    currentPlayer: 'X',
    gameOver: false,
    winner: null,
  });

  const [numberGame, setNumberGame] = useState<NumberGameState>({
    targetNumber: Math.floor(Math.random() * 100) + 1,
    triesLeft: 10,
    gameOver: false,
  });

  const startGame = (game: string) => {
    setCurrentGame(game);
    if (game === 'tictactoe') {
      setTicTacToe({
        board: Array(9).fill(''),
        currentPlayer: 'X',
        gameOver: false,
        winner: null,
      });
    } else if (game === 'guess') {
      setNumberGame({
        targetNumber: Math.floor(Math.random() * 100) + 1,
        triesLeft: 10,
        gameOver: false,
      });
    }
  };

  const updateTicTacToe = (position: number): string => {
    if (ticTacToe.gameOver) {
      return 'Game is over! Type "exit" to quit or "games tictactoe" to start a new game.';
    }

    const index = position - 1;
    if (ticTacToe.board[index]) {
      return 'That position is already taken! Try another.';
    }

    const newBoard = [...ticTacToe.board];
    newBoard[index] = ticTacToe.currentPlayer;

    const winner = checkWinner(newBoard);
    const gameOver = winner !== null;

    setTicTacToe({
      board: newBoard,
      currentPlayer: ticTacToe.currentPlayer === 'X' ? 'O' : 'X',
      gameOver,
      winner,
    });

    let response = formatBoard(newBoard) + '\n';
    if (winner === 'tie') {
      response += "It's a tie!";
    } else if (winner) {
      response += `Player ${winner} wins!`;
    } else {
      response += `Player ${ticTacToe.currentPlayer === 'X' ? 'O' : 'X'}'s turn!`;
    }
    
    return response;
  };

  const updateNumberGame = (guess: number): string => {
    if (numberGame.gameOver) {
      return 'Game is over! Type "exit" to quit or "games guess" to start a new game.';
    }

    const newTriesLeft = numberGame.triesLeft - 1;
    let response = '';

    if (guess === numberGame.targetNumber) {
      setNumberGame({ ...numberGame, gameOver: true });
      return 'Congratulations! You guessed the number correctly!';
    }

    if (newTriesLeft === 0) {
      setNumberGame({ ...numberGame, gameOver: true });
      return `Game Over! The number was ${numberGame.targetNumber}. Better luck next time!`;
    }

    setNumberGame({ ...numberGame, triesLeft: newTriesLeft });
    
    response = guess > numberGame.targetNumber ? 'Too high!' : 'Too low!';
    return `${response}\nYou have ${newTriesLeft} tries remaining.`;
  };

  const exitGame = () => {
    setCurrentGame(null);
  };

  return (
    <GameContext.Provider
      value={{
        currentGame,
        ticTacToe,
        numberGame,
        updateTicTacToe,
        updateNumberGame,
        startGame,
        exitGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};