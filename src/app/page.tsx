'use client';

import { useMemo, useState } from 'react';

type Player = 'X' | 'O';
type Cell = Player | null;

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

const emptyBoard = (): Cell[] => Array<Cell>(9).fill(null);

function getWinningLine(board: Cell[]): number[] {
  const line = WINNING_LINES.find(([first, second, third]) => {
    return board[first] && board[first] === board[second] && board[first] === board[third];
  });

  return line ? [...line] : [];
}

export default function Home() {
  const [board, setBoard] = useState<Cell[]>(() => emptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [scores, setScores] = useState<Record<Player, number>>({ X: 0, O: 0 });
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [isDraw, setIsDraw] = useState(false);

  const roundOver = winner !== null || isDraw;
  const openCells = useMemo(() => board.filter((cell) => cell === null).length, [board]);

  function playCell(index: number) {
    if (board[index] || roundOver) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    const nextWinningCells = getWinningLine(nextBoard);

    setBoard(nextBoard);

    if (nextWinningCells.length > 0) {
      setWinner(currentPlayer);
      setWinningCells(nextWinningCells);
      setScores((previousScores) => ({
        ...previousScores,
        [currentPlayer]: previousScores[currentPlayer] + 1,
      }));
      return;
    }

    if (openCells === 1) {
      setIsDraw(true);
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  }

  function resetRound() {
    setBoard(emptyBoard());
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCells([]);
    setIsDraw(false);
  }

  function resetSession() {
    resetRound();
    setScores({ X: 0, O: 0 });
  }

  const statusMessage = winner
    ? `${winner} wins this round!`
    : isDraw
      ? 'It’s a draw — beautifully played.'
      : `${currentPlayer}’s turn to play`;

  return (
    <main className="game-shell">
      <section className="game-card" aria-labelledby="game-title">
        <header className="game-header">
          <div>
            <p className="eyebrow">The friendly classic</p>
            <h1 id="game-title">Tic-Tac-Toe</h1>
            <p className="subtitle">Three in a row. Big bragging rights.</p>
          </div>
          <div className="round-badge" aria-label="Two player game">
            <span className="round-badge-dot" aria-hidden="true" />
            <span>2 players</span>
          </div>
        </header>

        <div className="score-row" aria-label="Current session score">
          <div className={`score-card score-card-x ${currentPlayer === 'X' && !roundOver ? 'is-active' : ''}`}>
            <span className="score-mark score-mark-x" aria-hidden="true">
              X
            </span>
            <span className="score-label">Player X</span>
            <strong className="score-value">{scores.X}</strong>
          </div>
          <div className="score-divider" aria-hidden="true">
            <span>vs</span>
          </div>
          <div className={`score-card score-card-o ${currentPlayer === 'O' && !roundOver ? 'is-active' : ''}`}>
            <span className="score-mark score-mark-o" aria-hidden="true">
              O
            </span>
            <span className="score-label">Player O</span>
            <strong className="score-value">{scores.O}</strong>
          </div>
        </div>

        <div className={`turn-banner ${roundOver ? 'is-result' : ''}`} role="status" aria-live="polite">
          <span className="turn-indicator" aria-hidden="true">
            {winner ?? (isDraw ? '✦' : currentPlayer)}
          </span>
          <span>{statusMessage}</span>
        </div>

        <div className="board-wrap">
          <div className="board" role="grid" aria-label="Tic-Tac-Toe board">
            {board.map((cell, index) => {
              const isWinningCell = winningCells.includes(index);

              return (
                <button
                  className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ''} ${isWinningCell ? 'is-winning' : ''}`}
                  key={index}
                  type="button"
                  role="gridcell"
                  aria-label={cell ? `Cell ${index + 1}: ${cell}` : `Cell ${index + 1}: empty`}
                  aria-pressed={Boolean(cell)}
                  disabled={Boolean(cell) || roundOver}
                  onClick={() => playCell(index)}
                >
                  <span aria-hidden="true">{cell}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="game-actions">
          <button className="button button-primary" type="button" onClick={resetRound}>
            {roundOver ? 'Play again' : 'Restart round'}
          </button>
          <button className="button button-secondary" type="button" onClick={resetSession}>
            Reset score
          </button>
        </div>

        <p className="helper-text">
          {roundOver
            ? 'Same players, fresh board. Keep the streak going.'
            : `${openCells} open ${openCells === 1 ? 'space' : 'spaces'} left`}
        </p>
      </section>
    </main>
  );
}
