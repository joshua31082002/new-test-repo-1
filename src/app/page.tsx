"use client";

import { useState } from "react";

type Mark = "X" | "O";
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
];

function getWinner(board: Cell[]) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], line: [a, b, c] };
    }
  }
  return null;
}

function getStatus(board: Cell[], turn: Mark) {
  const winner = getWinner(board);
  if (winner) return { label: `${winner.mark} wins!`, winner: winner.mark };
  if (board.every(Boolean)) return { label: "It’s a draw", winner: null };
  return { label: `${turn}'s turn`, winner: null };
}

export default function Home() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Mark>("X");
  const [scores, setScores] = useState<Record<Mark, number>>({ X: 0, O: 0 });

  const winner = getWinner(board);
  const status = getStatus(board, turn);
  const gameOver = Boolean(winner) || board.every(Boolean);

  function play(index: number) {
    if (board[index] || gameOver) return;

    const nextBoard = [...board];
    nextBoard[index] = turn;
    const nextWinner = getWinner(nextBoard);

    setBoard(nextBoard);
    if (nextWinner) {
      setScores((current) => ({ ...current, [nextWinner.mark]: current[nextWinner.mark] + 1 }));
    } else {
      setTurn(turn === "X" ? "O" : "X");
    }
  }

  function resetRound() {
    setBoard(Array(9).fill(null));
    setTurn("X");
  }

  function resetMatch() {
    resetRound();
    setScores({ X: 0, O: 0 });
  }

  return (
    <main className="game-shell">
      <div className="game-card">
        <header className="game-header">
          <div className="eyebrow"><span className="eyebrow-dot" /> Two player game</div>
          <h1>Tic <span>tak</span> toe</h1>
          <p>Three in a row. That’s all it takes.</p>
        </header>

        <section className="scoreboard" aria-label="Scoreboard">
          <div className={`score-card score-x ${turn === "X" && !gameOver ? "active" : ""}`}>
            <span className="score-mark">X</span>
            <span className="score-name">Player one</span>
            <strong>{scores.X}</strong>
          </div>
          <div className="versus">vs</div>
          <div className={`score-card score-o ${turn === "O" && !gameOver ? "active" : ""}`}>
            <span className="score-mark">O</span>
            <span className="score-name">Player two</span>
            <strong>{scores.O}</strong>
          </div>
        </section>

        <section className="play-area" aria-label="Tic-tac-toe game">
          <div className={`status status-${status.winner?.toLowerCase() ?? "turn"}`} aria-live="polite">
            {status.winner ? <span className="status-spark">✦</span> : null}
            <span>{status.label}</span>
          </div>
          <div className="board" role="grid" aria-label="Game board">
            {board.map((cell, index) => (
              <button
                className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ""} ${winner?.line.includes(index) ? "winning" : ""}`}
                key={index}
                onClick={() => play(index)}
                aria-label={cell ? `Cell ${index + 1}: ${cell}` : `Cell ${index + 1}, empty`}
                disabled={Boolean(cell) || gameOver}
                role="gridcell"
              >
                {cell}
              </button>
            ))}
          </div>
          <button className="reset-round" onClick={resetRound}>↻ <span>Reset round</span></button>
        </section>

        <footer className="game-footer">
          <span>First to 3 wins takes the match</span>
          <button className="reset-match" onClick={resetMatch}>Reset match</button>
        </footer>
      </div>
      <p className="footer-note">Made for friendly competition <span>·</span> 2024</p>
    </main>
  );
}
