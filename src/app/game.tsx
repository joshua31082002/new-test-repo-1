'use client';

import { useEffect, useState } from 'react';
import { getComputerMove, getResult, type Cell, type GameResult } from '@/lib/game';

type Mode = 'local' | 'computer';
type Scoreboard = { xWins: number; oWins: number; draws: number };

const emptyBoard = (): Cell[] => Array.from({ length: 9 }, () => null);

export default function Game() {
  const [mode, setMode] = useState<Mode>('local');
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [result, setResult] = useState<GameResult>(null);
  const [score, setScore] = useState<Scoreboard>({ xWins: 0, oWins: 0, draws: 0 });
  const [message, setMessage] = useState('X starts. Choose a square.');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/scoreboard', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load scoreboard');
        return response.json() as Promise<Scoreboard>;
      })
      .then(setScore)
      .catch(() => setMessage('The game is ready, but the scoreboard could not load.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (mode !== 'computer' || turn !== 'O' || result) return;
    const timer = window.setTimeout(() => {
      const move = getComputerMove(board);
      if (move < 0) return;
      play(move, 'O');
    }, 560);
    return () => window.clearTimeout(timer);
  }, [board, mode, result, turn]);

  function restart(nextMode = mode) {
    setMode(nextMode);
    setBoard(emptyBoard());
    setTurn('X');
    setResult(null);
    setMessage(nextMode === 'computer' ? 'You are X. Make the first move.' : 'X starts. Choose a square.');
  }

  function play(index: number, mark: 'X' | 'O') {
    if (board[index] || result) return;
    const nextBoard = [...board];
    nextBoard[index] = mark;
    const nextResult = getResult(nextBoard);
    setBoard(nextBoard);
    if (nextResult) {
      setResult(nextResult);
      void saveResult(nextResult);
      return;
    }
    const nextTurn = mark === 'X' ? 'O' : 'X';
    setTurn(nextTurn);
    setMessage(mode === 'computer' && nextTurn === 'O' ? 'Computer is thinking…' : `${nextTurn} to move.`);
  }

  async function saveResult(finalResult: Exclude<GameResult, null>) {
    setSaving(true);
    const apiResult = finalResult === 'X' ? 'x' : finalResult === 'O' ? 'o' : 'draw';
    setMessage(finalResult === 'draw' ? 'Draw game. Saving the round…' : `${finalResult} wins. Saving the round…`);
    try {
      const response = await fetch('/api/scoreboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ result: apiResult }) });
      if (!response.ok) throw new Error('Unable to save result');
      setScore(await response.json() as Scoreboard);
      setMessage('Round saved. Ready for another?');
    } catch {
      setMessage('The round finished, but saving failed.');
    } finally {
      setSaving(false);
    }
  }

  async function resetScoreboard() {
    if (!window.confirm('Reset all scoreboard totals?')) return;
    const response = await fetch('/api/scoreboard', { method: 'DELETE' });
    if (!response.ok) {
      setMessage('The scoreboard could not be reset.');
      return;
    }
    setScore(await response.json() as Scoreboard);
    setMessage('Scoreboard reset.');
  }

  const winningCells = result && result !== 'draw'
    ? [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].find(([a, b, c]) => board[a!] === result && board[b!] === result && board[c!] === result) ?? []
    : [];
  const computerTurn = mode === 'computer' && turn === 'O' && !result;

  return (
    <main className="game-shell">
      <div className="game-frame">
        <header className="hero">
          <p className="eyebrow">A little game for any table</p>
          <h1>Three in a row<span>.</span></h1>
          <p className="intro">A calm, tactile tic tac toe table for two people or one determined mind.</p>
        </header>

        <section className="score-card" aria-labelledby="score-title">
          <div className="score-heading"><div><p className="eyebrow">The running tally</p><h2 id="score-title">Scoreboard</h2></div><span className="score-dot" aria-hidden="true" /></div>
          <div className="score-list">
            <div><span>{mode === 'computer' ? 'You' : 'Player X'}</span><strong>{loading ? '—' : score.xWins}</strong></div>
            <div><span>{mode === 'computer' ? 'Computer' : 'Player O'}</span><strong>{loading ? '—' : score.oWins}</strong></div>
            <div><span>Draws</span><strong>{loading ? '—' : score.draws}</strong></div>
          </div>
          <button className="reset-button" type="button" onClick={resetScoreboard}>Reset scoreboard</button>
        </section>

        <section className="play-card" aria-labelledby="round-title">
          <div className="play-heading"><div><p className="eyebrow">{mode === 'computer' ? 'Solo match' : 'Pass and play'}</p><h2 id="round-title">Make your move</h2></div><span className="status-pill" aria-live="polite">{saving ? 'Saving' : result ? 'Complete' : `${turn} to move`}</span></div>
          <div className="mode-switch" role="group" aria-label="Game mode">
            <button type="button" className={mode === 'local' ? 'selected' : ''} onClick={() => restart('local')} aria-pressed={mode === 'local'}>Two players</button>
            <button type="button" className={mode === 'computer' ? 'selected' : ''} onClick={() => restart('computer')} aria-pressed={mode === 'computer'}>Vs computer</button>
          </div>
          <p className="live-message" aria-live="polite">{message}</p>
          <div className="board" role="grid" aria-label="Tic tac toe board">
            {board.map((cell, index) => <button key={index} type="button" className={`cell ${cell ? `mark-${cell.toLowerCase()}` : ''} ${winningCells.includes(index) ? 'winning' : ''}`} onClick={() => play(index, turn)} disabled={Boolean(cell) || Boolean(result) || computerTurn} role="gridcell" aria-label={cell ? `Square ${index + 1}, ${cell}` : `Square ${index + 1}, empty`}>{cell}</button>)}
          </div>
          <div className="round-footer"><p>{result ? 'The board is ready for another round.' : 'First to three marks wins.'}</p><button type="button" className="primary-button" onClick={() => restart()}>{result ? 'Play again' : 'New round'}</button></div>
        </section>

        <p className="page-note">No timers. No pressure. Just nine squares and a fresh start.</p>
      </div>
    </main>
  );
}
