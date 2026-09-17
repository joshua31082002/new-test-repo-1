export type Mark = 'X' | 'O';
export type Cell = Mark | null;
export type GameResult = Mark | 'draw' | null;

export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function getResult(board: Cell[]): GameResult {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.every(Boolean) ? 'draw' : null;
}

export function getComputerMove(board: Cell[]): number {
  const available = board.flatMap((cell, index) => (cell ? [] : [index]));

  const findWinningMove = (mark: Mark) =>
    available.find((index) => {
      const next = [...board];
      next[index] = mark;
      return getResult(next) === mark;
    });

  const winningMove = findWinningMove('O');
  if (winningMove !== undefined) return winningMove;

  const blockingMove = findWinningMove('X');
  if (blockingMove !== undefined) return blockingMove;

  if (!board[4]) return 4;

  const corners = [0, 2, 6, 8].filter((index) => !board[index]);
  if (corners.length > 0) return corners[0] ?? -1;

  return available[0] ?? -1;
}
