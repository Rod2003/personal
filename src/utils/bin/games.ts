let currentGame: string | null = null;
let ticTacToeState = {
  board: Array(9).fill(''),
  currentPlayer: 'X' as 'X' | 'O',
  gameOver: false
};
let numberGameState = {
  targetNumber: Math.floor(Math.random() * 100) + 1,
  triesLeft: 10,
  gameOver: false
};

// Helper for checking win conditions
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

// Format the board for display
const formatBoard = (board: string[]): string => {
  let display = '\n';
  for (let i = 0; i < 9; i += 3) {
    display += ` ${board[i] || ' '} │ ${board[i + 1] || ' '} │ ${board[i + 2] || ' '} \n`;
    if (i < 6) display += '───┼───┼───\n';
  }
  return display;
};

// Main games command
export const games = async (args: string[]): Promise<string> => {
  if (!args.length || args[0] === 'help') {
    return `Available games:
1. tictactoe - Classic Tic Tac Toe game
2. guess - Number guessing game

Usage:
  games <game_name> - Start a game
  games help - Show this help message
  
During games:
  move <position> - Make a move in Tic Tac Toe (1-9)
  guess <number> - Make a guess (1-100)
  exit - Quit current game`;
  }

  const game = args[0].toLowerCase();

  switch (game) {
    case 'tictactoe':
      currentGame = 'tictactoe';
      ticTacToeState = {
        board: Array(9).fill(''),
        currentPlayer: 'X',
        gameOver: false
      };
      return `Welcome to Tic Tac Toe!

Instructions:
- Enter a number (1-9) to place your mark
- Numbers correspond to positions:
 1 │ 2 │ 3 
───┼───┼───
 4 │ 5 │ 6 
───┼───┼───
 7 │ 8 │ 9 

Type 'move <position>' to play (e.g., 'move 5' for center)
Type 'exit' to quit the game

${formatBoard(ticTacToeState.board)}
Player X's turn!`;

    case 'guess':
      currentGame = 'guess';
      numberGameState = {
        targetNumber: Math.floor(Math.random() * 100) + 1,
        triesLeft: 10,
        gameOver: false
      };
      return `Welcome to the Number Guessing Game!

I'm thinking of a number between 1 and 100.
Type 'guess <number>' to make a guess.
Type 'exit' to quit the game.

You have ${numberGameState.triesLeft} tries remaining. Good luck!`;

    default:
      return `Game '${game}' not found. Type 'games help' to see available games.`;
  }
};

// Process tic tac toe moves
export const move = async (args: string[]): Promise<string> => {
  if (currentGame !== 'tictactoe') {
    return 'No Tic Tac Toe game in progress. Type "games tictactoe" to start one!';
  }

  if (!args.length) {
    return 'Usage: move <position> - Enter a position (1-9) to place your mark';
  }

  if (ticTacToeState.gameOver) {
    return 'Game is over! Type "exit" to quit or "games tictactoe" to start a new game.';
  }

  const position = parseInt(args[0]);
  if (isNaN(position) || position < 1 || position > 9) {
    return 'Invalid move! Please enter a number between 1 and 9.';
  }

  const index = position - 1;
  if (ticTacToeState.board[index]) {
    return 'That position is already taken! Try another.';
  }

  // Make the move
  const newBoard = [...ticTacToeState.board];
  newBoard[index] = ticTacToeState.currentPlayer;

  // Check for winner
  const winner = checkWinner(newBoard);
  let response = formatBoard(newBoard) + '\n';

  if (winner === 'tie') {
    ticTacToeState.gameOver = true;
    response += "It's a tie!";
  } else if (winner) {
    ticTacToeState.gameOver = true;
    response += `Player ${winner} wins!`;
  } else {
    ticTacToeState.currentPlayer = ticTacToeState.currentPlayer === 'X' ? 'O' : 'X';
    response += `Player ${ticTacToeState.currentPlayer}'s turn!`;
  }

  ticTacToeState.board = newBoard;
  return response;
};

// Process number guesses
export const guess = async (args: string[]): Promise<string> => {
  if (currentGame !== 'guess') {
    return 'No Number Guessing game in progress. Type "games guess" to start one!';
  }

  if (!args.length) {
    return 'Usage: guess <number> - Guess a number between 1 and 100';
  }

  if (numberGameState.gameOver) {
    return 'Game is over! Type "exit" to quit or "games guess" to start a new game.';
  }

  const guess = parseInt(args[0]);
  if (isNaN(guess) || guess < 1 || guess > 100) {
    return 'Invalid guess! Please enter a number between 1 and 100.';
  }

  numberGameState.triesLeft--;

  if (guess === numberGameState.targetNumber) {
    numberGameState.gameOver = true;
    return `Congratulations! You guessed the number ${guess} correctly in ${10 - numberGameState.triesLeft} tries!`;
  }

  if (numberGameState.triesLeft === 0) {
    numberGameState.gameOver = true;
    return `Game Over! The number was ${numberGameState.targetNumber}. Better luck next time!`;
  }

  const hint = guess > numberGameState.targetNumber ? 'Too high!' : 'Too low!';
  return `${hint}\nYou have ${numberGameState.triesLeft} tries remaining.`;
};

// Exit current game
export const exit = async (args: string[]): Promise<string> => {
  if (!currentGame) {
    return 'No game in progress.';
  }
  
  const exitedGame = currentGame;
  currentGame = null;
  return `Exited ${exitedGame}. Type "games" to see available games!`;
};