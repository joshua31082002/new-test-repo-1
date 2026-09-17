'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Point = { x: number; y: number };
type GameStatus = 'ready' | 'playing' | 'paused' | 'game-over';

const GRID_SIZE = 20;
const START_SPEED = 170;
const MIN_SPEED = 72;
const SPEED_STEP = 7;
const HIGH_SCORE_KEY = 'snake-high-score';
const DIRECTIONS: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
};
const STARTING_SNAKE: Point[] = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];

function samePoint(a: Point, b: Point) { return a.x === b.x && a.y === b.y; }
function randomFood(snake: Point[]): Point {
  const openCells: Point[] = [];
  for (let y = 0; y < GRID_SIZE; y += 1) for (let x = 0; x < GRID_SIZE; x += 1) {
    if (!snake.some((segment) => segment.x === x && segment.y === y)) openCells.push({ x, y });
  }
  return openCells[Math.floor(Math.random() * openCells.length)] ?? { x: 2, y: 2 };
}

export default function Home() {
  const [snake, setSnake] = useState(STARTING_SNAKE);
  const [food, setFood] = useState<Point>(() => randomFood(STARTING_SNAKE));
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [status, setStatus] = useState<GameStatus>('ready');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [speed, setSpeed] = useState(START_SPEED);
  const directionRef = useRef(direction);
  const scoreRef = useRef(score);
  const foodRef = useRef(food);
  const bestScoreRef = useRef(bestScore);

  useEffect(() => {
    const storedBest = window.localStorage.getItem(HIGH_SCORE_KEY);
    const parsedBest = storedBest ? Number.parseInt(storedBest, 10) : 0;
    if (Number.isFinite(parsedBest)) { setBestScore(parsedBest); bestScoreRef.current = parsedBest; }
  }, []);

  const startGame = useCallback(() => {
    setSnake(STARTING_SNAKE); setFood(randomFood(STARTING_SNAKE));
    directionRef.current = { x: 1, y: 0 }; setDirection({ x: 1, y: 0 });
    scoreRef.current = 0; setScore(0); setSpeed(START_SPEED); setStatus('playing');
  }, []);

  const handleDirection = useCallback((nextDirection: Point) => {
    const current = directionRef.current;
    if (nextDirection.x === -current.x && nextDirection.y === -current.y) return;
    directionRef.current = nextDirection; setDirection(nextDirection);
    if (status === 'ready') setStatus('playing');
  }, [status]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (DIRECTIONS[event.key]) { event.preventDefault(); handleDirection(DIRECTIONS[event.key]); }
      if (event.key === ' ') { event.preventDefault(); setStatus((current) => current === 'playing' ? 'paused' : current === 'paused' ? 'playing' : current); }
      if (event.key === 'Enter' && (status === 'ready' || status === 'game-over')) startGame();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirection, startGame, status]);

  useEffect(() => {
    if (status !== 'playing') return;
    const tick = window.setInterval(() => {
      const nextDirection = directionRef.current;
      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const nextHead = { x: head.x + nextDirection.x, y: head.y + nextDirection.y };
        const hitsWall = nextHead.x < 0 || nextHead.x >= GRID_SIZE || nextHead.y < 0 || nextHead.y >= GRID_SIZE;
        const willEat = samePoint(nextHead, foodRef.current);
        const hitsSelf = currentSnake.slice(0, willEat ? currentSnake.length : -1).some((segment) => samePoint(segment, nextHead));
        if (hitsWall || hitsSelf) { setStatus('game-over'); return currentSnake; }
        const nextSnake = [nextHead, ...currentSnake];
        if (willEat) {
          const nextScore = scoreRef.current + 10; scoreRef.current = nextScore; setScore(nextScore);
          const nextFood = randomFood(nextSnake); foodRef.current = nextFood; setFood(nextFood);
          setSpeed((currentSpeed) => Math.max(MIN_SPEED, currentSpeed - SPEED_STEP));
          if (nextScore > bestScoreRef.current) { bestScoreRef.current = nextScore; setBestScore(nextScore); window.localStorage.setItem(HIGH_SCORE_KEY, String(nextScore)); }
          return nextSnake;
        }
        return nextSnake.slice(0, -1);
      });
    }, speed);
    return () => window.clearInterval(tick);
  }, [speed, status]);

  const occupiedCells = useMemo(() => new Map(snake.map((segment, index) => [`${segment.x}-${segment.y}`, index])), [snake]);
  const statusLabel = status === 'ready' ? 'Ready when you are' : status === 'playing' ? 'Run in progress' : status === 'paused' ? 'Paused' : 'Run complete';
  const statusText = status === 'ready' ? 'Press start or any direction to launch.' : status === 'playing' ? 'Use arrows or WASD to steer.' : status === 'paused' ? 'Take a breath. Press resume when ready.' : 'You hit the edge. Reset and chase a new high score.';

  return (
    <main className="arcade-shell"><div className="scanlines" aria-hidden="true" /><div className="arcade-frame">
      <header className="game-header"><div><p className="eyebrow">NEON ARCADE / 001</p><h1>SNAKE<span className="title-dot">.</span></h1></div><div className="header-note"><span className="pulse-dot" /><span>CHASE THE GLOW</span></div></header>
      <section className="game-layout" aria-label="Snake game"><div className="board-column">
        <div className="score-row" aria-label="Scoreboard"><div className="score-block"><span>Score</span><strong>{String(score).padStart(4, '0')}</strong></div><div className="score-block score-block-best"><span>Best</span><strong>{String(bestScore).padStart(4, '0')}</strong></div></div>
        <div className="board-wrap"><div className="board" role="img" aria-label={`Snake board. ${statusLabel}. Score ${score}.`}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => { const x = index % GRID_SIZE; const y = Math.floor(index / GRID_SIZE); const cellKey = `${x}-${y}`; const snakeIndex = occupiedCells.get(cellKey); const isFood = samePoint(food, { x, y }); return <span key={cellKey} className={`cell ${snakeIndex !== undefined ? (snakeIndex === 0 ? 'snake head' : 'snake') : ''} ${isFood ? 'food' : ''}`} />; })}
          {status !== 'playing' && <div className="board-overlay"><span className="overlay-kicker">{status === 'game-over' ? 'GAME OVER' : status === 'paused' ? 'PAUSED' : 'READY PLAYER'}</span><strong>{status === 'game-over' ? `SCORE ${String(score).padStart(4, '0')}` : status === 'paused' ? 'PRESS RESUME' : 'ENTER THE GRID'}</strong></div>}
        </div></div>
        <div className="status-line" role="status" aria-live="polite"><span className={`status-indicator status-${status}`} /><span><strong>{statusLabel}</strong> — {statusText}</span></div>
      </div><aside className="control-panel"><div className="panel-section"><span className="panel-label">Mission</span><p>Eat the light.<br />Stay inside.</p></div><div className="panel-rule" /><div className="panel-section controls-section"><span className="panel-label">Controls</span><div className="keys" aria-label="Keyboard controls"><kbd>↑</kbd><div><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd></div></div><p className="control-caption">or use <strong>W A S D</strong></p><p className="control-caption"><kbd className="space-key">SPACE</kbd> pause</p></div><div className="panel-rule" /><div className="panel-section action-section"><button className="arcade-button primary-button" onClick={status === 'paused' ? () => setStatus('playing') : startGame} type="button">{status === 'paused' ? 'Resume run' : status === 'playing' ? 'Restart run' : 'Start run'} <span>↗</span></button>{status === 'playing' && <button className="arcade-button secondary-button" onClick={() => setStatus('paused')} type="button">Pause</button>}</div></aside></section>
      <footer className="game-footer"><span>BUILD YOUR STREAK</span><span>LOCAL SCORE ONLY</span><span>NO ESCAPE / JUST FOCUS</span></footer>
    </div></main>
  );
}
