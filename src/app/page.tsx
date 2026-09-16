'use client';

import { useMemo, useState } from 'react';

type Mark = 'X' | 'O';
type Cell = Mark | null;

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

function getResult(board: Cell[]) {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line;

    if (board[first] && board[first] === board[second] && board[first] === board[third]) {
      return { winner: board[first], winningLine: line } as const;
    }
  }

  if (board.every(Boolean)) {
    return { winner: 'draw' as const, winningLine: [] as number[] };
  }

  return { winner: null, winningLine: [] as number[] };
}

export default function Home() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Mark>('X');
  const [score, setScore] = useState<Record<Mark, number>>({ X: 0, O: 0 });

  const result = useMemo(() => getResult(board), [board]);
  const isComplete = result.winner !== null;
  const status = result.winner
    ? result.winner === 'draw'
      ? 'Round tied'
      : `${result.winner} takes the round`
    : `${currentPlayer} to move`;

  function playCell(index: number) {
    if (board[index] || isComplete) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    const nextResult = getResult(nextBoard);

    setBoard(nextBoard);

    if (nextResult.winner && nextResult.winner !== 'draw') {
      setScore((previous) => ({
        ...previous,
        [nextResult.winner]: previous[nextResult.winner] + 1,
      }));
      return;
    }

    if (!nextResult.winner) {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  }

  function startNewRound() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
  }

  function resetMatch() {
    startNewRound();
    setScore({ X: 0, O: 0 });
  }

  return (
    <main className="game-shell">
      <section className="game-layout" aria-labelledby="game-title">
        <header className="game-header">
          <div className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Pass &amp; play
          </div>
          <h1 id="game-title">
            Tic <span>Tac</span> Toe
          </h1>
          <p>Three in a row. No second chances.</p>
        </header>

        <div className="player-strip" aria-label="Match score">
          <div className={`player-card player-card-x ${currentPlayer === 'X' && !isComplete ? 'is-active' : ''}`}>
            <span className="player-symbol symbol-x" aria-hidden="true">×</span>
            <div>
              <span className="player-label">Player X</span>
              <strong>{score.X}</strong>
            </div>
            {currentPlayer === 'X' && !isComplete && <span className="turn-pip">Playing</span>}
          </div>
          <div className="versus" aria-hidden="true">VS</div>
          <div className={`player-card player-card-o ${currentPlayer === 'O' && !isComplete ? 'is-active' : ''}`}>
            <span className="player-symbol symbol-o" aria-hidden="true">○</span>
            <div>
              <span className="player-label">Player O</span>
              <strong>{score.O}</strong>
            </div>
            {currentPlayer === 'O' && !isComplete && <span className="turn-pip">Playing</span>}
          </div>
        </div>

        <section className={`status-panel ${result.winner && result.winner !== 'draw' ? 'has-winner' : ''} ${result.winner === 'draw' ? 'is-draw' : ''}`} aria-live="polite">
          <span className="status-kicker">{isComplete ? 'Round complete' : 'Current turn'}</span>
          <strong>{status}</strong>
          <p>{result.winner ? 'Reset the board for another round.' : 'Make your move, then pass the device.'}</p>
        </section>

        <div className="board-wrap">
          <div className="board" role="grid" aria-label="Tic Tac Toe board">
            {board.map((cell, index) => {
              const isWinningCell = result.winningLine.some((winningIndex) => winningIndex === index);
              return (
                <button
                  key={index}
                  className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ''} ${isWinningCell ? 'is-winning' : ''}`}
                  type="button"
                  role="gridcell"
                  aria-label={cell ? `Cell ${index + 1}: ${cell}` : `Cell ${index + 1}: empty`}
                  disabled={Boolean(cell) || isComplete}
                  onClick={() => playCell(index)}
                >
                  {cell === 'X' ? '×' : cell === 'O' ? '○' : ''}
                </button>
              );
            })}
          </div>
        </div>

        <div className="game-actions">
          <button className="new-round" type="button" onClick={startNewRound}>
            <span aria-hidden="true">↻</span>
            {isComplete ? 'Play another round' : 'Reset round'}
          </button>
          <button className="match-reset" type="button" onClick={resetMatch}>Reset match</button>
        </div>

        <footer className="game-footer">
          <span>First to connect three wins</span>
          <span className="footer-mark" aria-hidden="true">◆</span>
          <span>Pass the device after each turn</span>
        </footer>
      </section>
    </main>
  );
}
