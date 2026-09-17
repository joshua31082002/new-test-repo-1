'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };
type Direction = 'up' | 'down' | 'left' | 'right';
type GameStatus = 'ready' | 'playing' | 'paused' | 'game-over';

const GRID_SIZE = 18;
const STARTING_SNAKE: Point[] = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
];
const STARTING_FOOD = { x: 13, y: 9 };
const INITIAL_DIRECTION: Direction = 'right';
const BEST_SCORE_KEY = 'neon-snake-best-score';

const DIRECTIONS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

const KEY_DIRECTIONS: Record<string, Direction> = {
  ArrowUp: 'up',
  w: 'up',
  W: 'up',
  ArrowDown: 'down',
  s: 'down',
  S: 'down',
  ArrowLeft: 'left',
  a: 'left',
  A: 'left',
  ArrowRight: 'right',
  d: 'right',
  D: 'right',
};

function samePoint(first: Point, second: Point) {
  return first.x === second.x && first.y === second.y;
}

function getNextFood(snake: Point[]): Point {
  const openCells: Point[] = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const cell = { x, y };
      if (!snake.some((segment) => samePoint(segment, cell))) {
        openCells.push(cell);
      }
    }
  }

  return openCells[Math.floor(Math.random() * openCells.length)] ?? STARTING_FOOD;
}

function getTickRate(score: number) {
  return Math.max(78, 155 - score * 4);
}

export default function Home() {
  const [snake, setSnake] = useState<Point[]>(STARTING_SNAKE);
  const [food, setFood] = useState<Point>(STARTING_FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [queuedDirection, setQueuedDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === 'undefined') {
      return 0;
    }

    const savedScore = window.localStorage.getItem(BEST_SCORE_KEY);
    return savedScore ? Number.parseInt(savedScore, 10) || 0 : 0;
  });
  const [status, setStatus] = useState<GameStatus>('ready');
  const directionRef = useRef(direction);
  const queuedDirectionRef = useRef(queuedDirection);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    queuedDirectionRef.current = queuedDirection;
  }, [queuedDirection]);

  const finishGame = useCallback(() => {
    setStatus('game-over');
    setBestScore((currentBest) => {
      setScore((currentScore) => {
        const nextBest = Math.max(currentBest, currentScore);
        window.localStorage.setItem(BEST_SCORE_KEY, String(nextBest));
        return currentScore;
      });
      return currentBest;
    });
  }, []);

  const stepGame = useCallback(() => {
    const nextDirection = queuedDirectionRef.current;
    const movement = DIRECTIONS[nextDirection];
    const head = snake[0];
    const nextHead = { x: head.x + movement.x, y: head.y + movement.y };
    const hitWall =
      nextHead.x < 0 ||
      nextHead.x >= GRID_SIZE ||
      nextHead.y < 0 ||
      nextHead.y >= GRID_SIZE;
    const ateFood = samePoint(nextHead, food);
    const bodyToCheck = ateFood ? snake : snake.slice(0, -1);
    const hitSelf = bodyToCheck.some((segment) => samePoint(segment, nextHead));

    if (hitWall || hitSelf) {
      finishGame();
      return;
    }

    const nextSnake = [nextHead, ...snake];
    if (!ateFood) {
      nextSnake.pop();
    }

    setDirection(nextDirection);
    setSnake(nextSnake);

    if (ateFood) {
      setScore((currentScore) => currentScore + 1);
      setFood(getNextFood(nextSnake));
    }
  }, [finishGame, food, snake]);

  useEffect(() => {
    if (status !== 'playing') {
      return undefined;
    }

    const timer = window.setInterval(stepGame, getTickRate(score));
    return () => window.clearInterval(timer);
  }, [score, status, stepGame]);

  const changeDirection = useCallback(
    (nextDirection: Direction) => {
      if (nextDirection === OPPOSITES[directionRef.current]) {
        return;
      }

      queuedDirectionRef.current = nextDirection;
      setQueuedDirection(nextDirection);
    },
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const nextDirection = KEY_DIRECTIONS[event.key];
      if (nextDirection) {
        event.preventDefault();
        changeDirection(nextDirection);
        return;
      }

      if (event.key === ' ' && status !== 'ready' && status !== 'game-over') {
        event.preventDefault();
        setStatus((currentStatus) =>
          currentStatus === 'playing' ? 'paused' : 'playing',
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, status]);

  const startGame = () => {
    setSnake(STARTING_SNAKE);
    setFood(STARTING_FOOD);
    setDirection(INITIAL_DIRECTION);
    setQueuedDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    queuedDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setStatus('playing');
  };

  const togglePause = () => {
    if (status === 'playing' || status === 'paused') {
      setStatus((currentStatus) =>
        currentStatus === 'playing' ? 'paused' : 'playing',
      );
    }
  };

  const statusCopy = {
    ready: { eyebrow: 'Ready when you are', title: 'Guide the glow', body: 'Eat the coral dots. Grow the chain. Stay sharp.' },
    playing: { eyebrow: 'Run in progress', title: 'Keep moving', body: 'Use the arrows or WASD to turn.' },
    paused: { eyebrow: 'Game paused', title: 'Take a breath', body: 'Resume when you are ready to keep going.' },
    'game-over': { eyebrow: 'Run complete', title: 'That was close', body: 'Every run is a chance to beat your best.' },
  }[status];

  return (
    <main className="game-shell">
      <section className="game-layout" aria-label="Neon Snake game">
        <header className="game-header">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">+</span>
            <div>
              <p className="brand-kicker">Arcade / 001</p>
              <h1>Neon Snake</h1>
            </div>
          </div>
          <p className="header-note">A little focus goes a long way.</p>
        </header>

        <div className="game-stage">
          <aside className="game-sidebar">
            <div className="status-block" aria-live="polite">
              <p className="status-eyebrow">{statusCopy.eyebrow}</p>
              <h2>{statusCopy.title}</h2>
              <p>{statusCopy.body}</p>
            </div>

            <div className="score-row">
              <div className="score-card score-card-primary">
                <span>Score</span>
                <strong>{String(score).padStart(2, '0')}</strong>
              </div>
              <div className="score-card">
                <span>Best</span>
                <strong>{String(bestScore).padStart(2, '0')}</strong>
              </div>
            </div>

            <button className="primary-button" type="button" onClick={startGame}>
              <span>{status === 'ready' ? 'Start run' : 'Play again'}</span>
              <span aria-hidden="true">↗</span>
            </button>

            <div className="control-hint">
              <span className="hint-dot" aria-hidden="true" />
              <p><strong>Move</strong> Arrow keys or WASD</p>
              <p><strong>Pause</strong> Spacebar</p>
            </div>
          </aside>

          <div className="board-column">
            <div className={`board-frame board-${status}`}>
              <div
                className="game-board"
                role="grid"
                aria-label={`Snake game board. Current score ${score}.`}
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
              >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
                  const point = { x: index % GRID_SIZE, y: Math.floor(index / GRID_SIZE) };
                  const snakeIndex = snake.findIndex((segment) => samePoint(segment, point));
                  const isFood = samePoint(food, point);
                  const classNames = [
                    'board-cell',
                    snakeIndex === 0 ? 'snake-head' : '',
                    snakeIndex > 0 ? 'snake-cell' : '',
                    isFood ? 'food-cell' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return <div className={classNames} key={`${point.x}-${point.y}`} role="gridcell" />;
                })}
                {status !== 'playing' && (
                  <div className="board-overlay">
                    <span className="overlay-line" />
                    <p>{status === 'ready' ? 'Press start' : status === 'paused' ? 'Paused' : 'Run over'}</p>
                    <span className="overlay-line" />
                  </div>
                )}
              </div>
            </div>

            <div className="board-footer">
              <span className="live-indicator" />
              <span>{status === 'playing' ? 'Live session' : 'Local session'}</span>
              <span className="board-footer-spacer" />
              <span>18 × 18 grid</span>
            </div>
          </div>
        </div>

        <section className="mobile-controls" aria-label="Touch controls">
          <button type="button" aria-label="Move up" onClick={() => changeDirection('up')}>↑</button>
          <div>
            <button type="button" aria-label="Move left" onClick={() => changeDirection('left')}>←</button>
            <button className="pause-button" type="button" aria-label={status === 'paused' ? 'Resume game' : 'Pause game'} onClick={togglePause}>
              {status === 'paused' ? '▶' : 'Ⅱ'}
            </button>
            <button type="button" aria-label="Move right" onClick={() => changeDirection('right')}>→</button>
          </div>
          <button type="button" aria-label="Move down" onClick={() => changeDirection('down')}>↓</button>
        </section>

        <footer className="game-footer">
          <span>Stay curious.</span>
          <span className="footer-rule" />
          <span>Best score saves on this device</span>
        </footer>
      </section>
    </main>
  );
}
