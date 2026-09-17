'use client';

import { useEffect, useState } from 'react';

type Mark = 'X' | 'O';
type Cell = Mark | null;
type Mode = 'local' | 'computer';
type Result = 'x' | 'o' | 'draw';
type Score = { xWins: number; oWins: number; draws: number };

const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]] as const;
const blank = (): Cell[] => Array(9).fill(null);

function winner(board: Cell[]) {
  for (const line of lines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { mark: board[a], line };
  }
  return null;
}

function computerMove(board: Cell[]) {
  const tactical = (mark: Mark) => lines.flatMap((line) => {
    const [a,b,c] = line;
    const cells = [board[a], board[b], board[c]];
    return cells.filter((cell) => cell === mark).length === 2 && cells.includes(null) ? [line[cells.indexOf(null)]!] : [];
  })[0];
  return tactical ?? (!board[4] ? 4 : [0,2,6,8].find((i) => !board[i]) ?? board.findIndex((cell) => !cell));
}

export default function Home() {
  const [mode, setMode] = useState<Mode>('computer');
  const [board, setBoard] = useState<Cell[]>(blank);
  const [turn, setTurn] = useState<Mark>('X');
  const [result, setResult] = useState<Result | null>(null);
  const [winning, setWinning] = useState<number[]>([]);
  const [score, setScore] = useState<Score>({ xWins: 0, oWins: 0, draws: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('X starts. Choose a square.');
  const [error, setError] = useState('');

  useEffect(() => { fetch('/api/scoreboard', { cache: 'no-store' }).then((r) => r.json()).then(setScore).catch(() => setError('The scoreboard is unavailable.')).finally(() => setLoading(false)); }, []);
  const resetRound = (nextMode = mode) => { setMode(nextMode); setBoard(blank()); setTurn('X'); setResult(null); setWinning([]); setMessage(nextMode === 'computer' ? 'You are X. Make the first move.' : 'Player X starts.'); };
  const save = async (outcome: Result) => { const response = await fetch('/api/scoreboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ result: outcome }) }); if (!response.ok) throw new Error('save'); setScore(await response.json()); };
  const play = (index: number, mark: Mark) => {
    if (board[index] || result) return;
    const next = [...board]; next[index] = mark; const win = winner(next); const outcome = win ? (win.mark === 'X' ? 'x' : 'o') : next.every(Boolean) ? 'draw' : null;
    setBoard(next); if (win) setWinning([...win.line]); if (outcome) { setResult(outcome); setMessage(outcome === 'draw' ? 'A thoughtful draw.' : `${win?.mark} takes the round.`); save(outcome).catch(() => setError('The round finished, but saving failed.')); } else { const nextTurn = mark === 'X' ? 'O' : 'X'; setTurn(nextTurn); setMessage(nextTurn === 'O' && mode === 'computer' ? 'The table is thinking…' : `${nextTurn}'s turn.`); }
  };
  useEffect(() => { if (mode !== 'computer' || turn !== 'O' || result) return; const timer = window.setTimeout(() => { const move = computerMove(board); if (typeof move === 'number' && move >= 0) play(move, 'O'); }, 520); return () => window.clearTimeout(timer); }, [board, mode, result, turn]);
  const resetScores = async () => { if (!window.confirm('Reset the scoreboard?')) return; const response = await fetch('/api/scoreboard', { method: 'DELETE' }); if (response.ok) setScore(await response.json()); };

  return <main className="game-shell"><div className="game-container"><header className="topbar"><div className="brand-lockup"><span className="brand-mark">+</span><span className="brand-name">Grid &amp; Gather</span></div><span className="topbar-note">A little strategy, one square at a time.</span></header><div className="hero-grid"><section className="hero-copy"><p className="eyebrow">The classic, reset</p><h1 className="hero-title">Make your <em>mark.</em></h1><p className="hero-description">A quiet little table for sharp moves, close calls, and one more round.</p></section><section className="game-panel" aria-label="Tic tac toe game"><div className="mode-switcher"><span className="mode-label">Choose your table</span><div className="mode-options"><button className={`mode-button ${mode === 'computer' ? 'active' : ''}`} onClick={() => resetRound('computer')}>Solo</button><button className={`mode-button ${mode === 'local' ? 'active' : ''}`} onClick={() => resetRound('local')}>Two players</button></div></div><div className="board-header"><div className="status-line" aria-live="polite"><span className="status-dot" />{result ? (result === 'draw' ? 'Draw game' : `${result === 'x' ? 'X' : 'O'} wins`) : message}</div><span className="score-label">Round table</span></div><div className="board" role="grid" aria-label="Tic tac toe board">{board.map((cell, index) => <button className={`cell ${winning.includes(index) ? 'win' : ''}`} key={index} disabled={Boolean(cell || result || (mode === 'computer' && turn === 'O'))} onClick={() => play(index, turn)} aria-label={cell ? `Square ${index + 1}, ${cell}` : `Square ${index + 1}, empty`} role="gridcell">{cell && <span className={`cell-mark ${cell.toLowerCase()}`}>{cell === 'X' ? '×' : '○'}</span>}</button>)}</div><div className="action-row"><button className="primary-button" onClick={() => resetRound()}>{result ? 'Play another round' : 'Reset round'}</button><button className="secondary-button" onClick={() => resetRound(mode === 'computer' ? 'local' : 'computer')}>Switch table</button></div></section></div><section className="scoreboard"><div className="scoreboard-header"><h2 className="scoreboard-title">The running score</h2><button className="reset-button" onClick={resetScores}>Reset scoreboard</button></div><div className="score-grid"><div className="score-card"><div className="score-card-label">You / X <span className="mark-key x">×</span></div><strong className="score-number">{loading ? '—' : score.xWins}</strong></div><div className="score-card"><div className="score-card-label">{mode === 'computer' ? 'Table / O' : 'Player 2 / O'} <span className="mark-key o">○</span></div><strong className="score-number">{loading ? '—' : score.oWins}</strong></div><div className="score-card"><div className="score-card-label">Draws <span className="mark-key">—</span></div><strong className="score-number">{loading ? '—' : score.draws}</strong></div></div>{error && <p className="error-message" role="alert">{error}</p>}</section></div></main>;
}
