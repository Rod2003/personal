import { Command, CommandDefinition, CommandOutputKind } from '../types';

let currentGame: string | null = null;
let ticTacToeState = {
  board: Array(9).fill(''),
  currentPlayer: 'X' as 'X' | 'O',
  gameOver: false,
};
let numberGameState = {
  targetNumber: Math.floor(Math.random() * 100) + 1,
  triesLeft: 10,
  gameOver: false,
};

const checkWinner = (board: string[]): string | null => {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every((cell) => cell !== '')) return 'tie';
  return null;
};

const formatBoard = (board: string[]): string => {
  let display = '\n';
  for (let i = 0; i < 9; i += 3) {
    display += ` ${board[i] || ' '} │ ${board[i + 1] || ' '} │ ${board[i + 2] || ' '} \n`;
    if (i < 6) display += '───┼───┼───\n';
  }
  return display;
};

export const games: CommandDefinition = {
  name: Command.Games,
  description: 'Play interactive terminal games',
  requiresArgs: false,
  handler: async ({ args }) => {
    if (!args.length || args[0] === 'help') {
      return {
        kind: CommandOutputKind.Text,
        text: `Available games:
1. tictactoe - Classic Tic Tac Toe game
2. guess - Number guessing game

Usage:
  games <game_name> - Start a game
  games help - Show this help message
  
During games:
  move <position> - Make a move in Tic Tac Toe (1-9)
  guess <number> - Make a guess (1-100)`,
      };
    }

    const game = args[0].toLowerCase();

    switch (game) {
      case 'tictactoe':
        currentGame = 'tictactoe';
        ticTacToeState = {
          board: Array(9).fill(''),
          currentPlayer: 'X',
          gameOver: false,
        };
        return {
          kind: CommandOutputKind.Text,
          text: `Welcome to Tic Tac Toe!

Instructions:
- Enter a number (1-9) to place your mark
- Numbers correspond to positions:
 1 │ 2 │ 3 
───┼───┼───
 4 │ 5 │ 6 
───┼───┼───
 7 │ 8 │ 9 

Type 'move <position>' to play (e.g., 'move 5' for center)

${formatBoard(ticTacToeState.board)}
Player X's turn!`,
        };

      case 'guess':
        currentGame = 'guess';
        numberGameState = {
          targetNumber: Math.floor(Math.random() * 100) + 1,
          triesLeft: 10,
          gameOver: false,
        };
        return {
          kind: CommandOutputKind.Text,
          text: `Welcome to the Number Guessing Game!

I'm thinking of a number between 1 and 100.
Type 'guess <number>' to make a guess.

You have ${numberGameState.triesLeft} tries remaining. Good luck!`,
        };

      default:
        return {
          kind: CommandOutputKind.Text,
          text: `Game '${game}' not found. Type 'games help' to see available games.`,
        };
    }
  },
};

export const move: CommandDefinition = {
  name: Command.Move,
  description: 'Play a terminal-based movement game',
  requiresArgs: true,
  handler: async ({ args }) => {
    if (currentGame !== 'tictactoe') {
      return {
        kind: CommandOutputKind.Text,
        text: 'No Tic Tac Toe game in progress. Type "games tictactoe" to start one!',
      };
    }

    if (!args.length) {
      return {
        kind: CommandOutputKind.Text,
        text: 'Usage: move <position> - Enter a position (1-9) to place your mark',
      };
    }

    if (ticTacToeState.gameOver) {
      return {
        kind: CommandOutputKind.Text,
        text: 'Game is over! Type "games tictactoe" to start a new game.',
      };
    }

    const position = parseInt(args[0], 10);
    if (isNaN(position) || position < 1 || position > 9) {
      return {
        kind: CommandOutputKind.Text,
        text: 'Invalid move! Please enter a number between 1 and 9.',
      };
    }

    const index = position - 1;
    if (ticTacToeState.board[index]) {
      return {
        kind: CommandOutputKind.Text,
        text: 'That position is already taken! Try another.',
      };
    }

    const newBoard = [...ticTacToeState.board];
    newBoard[index] = ticTacToeState.currentPlayer;

    const winner = checkWinner(newBoard);
    let response = formatBoard(newBoard) + '\n';

    if (winner === 'tie') {
      ticTacToeState.gameOver = true;
      response += "It's a tie!";
    } else if (winner) {
      ticTacToeState.gameOver = true;
      response += `Player ${winner} wins!`;
    } else {
      ticTacToeState.currentPlayer =
        ticTacToeState.currentPlayer === 'X' ? 'O' : 'X';
      response += `Player ${ticTacToeState.currentPlayer}'s turn!`;
    }

    ticTacToeState.board = newBoard;
    return { kind: CommandOutputKind.Text, text: response };
  },
};

export const guess: CommandDefinition = {
  name: Command.Guess,
  description: 'Play a number guessing game',
  requiresArgs: true,
  handler: async ({ args }) => {
    if (currentGame !== 'guess') {
      return {
        kind: CommandOutputKind.Text,
        text: 'No Number Guessing game in progress. Type "games guess" to start one!',
      };
    }

    if (!args.length) {
      return {
        kind: CommandOutputKind.Text,
        text: 'Usage: guess <number> - Guess a number between 1 and 100',
      };
    }

    if (numberGameState.gameOver) {
      return {
        kind: CommandOutputKind.Text,
        text: 'Game is over! Type "games guess" to start a new game.',
      };
    }

    const guessValue = parseInt(args[0], 10);
    if (isNaN(guessValue) || guessValue < 1 || guessValue > 100) {
      return {
        kind: CommandOutputKind.Text,
        text: 'Invalid guess! Please enter a number between 1 and 100.',
      };
    }

    numberGameState.triesLeft--;

    if (guessValue === numberGameState.targetNumber) {
      numberGameState.gameOver = true;
      return {
        kind: CommandOutputKind.Text,
        text: `Congratulations! You guessed the number ${guessValue} correctly in ${10 - numberGameState.triesLeft} tries!`,
      };
    }

    if (numberGameState.triesLeft === 0) {
      numberGameState.gameOver = true;
      return {
        kind: CommandOutputKind.Text,
        text: `Game Over! The number was ${numberGameState.targetNumber}. Better luck next time!`,
      };
    }

    const hint = guessValue > numberGameState.targetNumber ? 'Too high!' : 'Too low!';
    return {
      kind: CommandOutputKind.Text,
      text: `${hint}\nYou have ${numberGameState.triesLeft} tries remaining.`,
    };
  },
};
