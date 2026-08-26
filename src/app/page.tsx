"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";
type GameStatus = "ready" | "playing" | "paused" | "gameover";

const GRID_SIZE = 20;
const STARTING_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const STARTING_FOOD = { x: 14, y: 10 };
const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function isSamePoint(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}

function createFood(snake: Point[]): Point {
  const available: Point[] = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      if (!snake.some((segment) => segment.x === x && segment.y === y)) {
        available.push({ x, y });
      }
    }
  }
  return available[Math.floor(Math.random() * available.length)] ?? STARTING_FOOD;
}

const directionKeys: Record<string, Direction> = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
};

export default function Home() {
  const [snake, setSnake] = useState<Point[]>(STARTING_SNAKE);
  const [food, setFood] = useState<Point>(STARTING_FOOD);
  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const directionRef = useRef<Direction>("right");

  useEffect(() => {
    const savedBest = window.localStorage.getItem("snake-best-score");
    if (!savedBest) return;
    const timeout = window.setTimeout(() => setBestScore(Number(savedBest)), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const startGame = useCallback(() => {
    const initialDirection = "right";
    directionRef.current = initialDirection;
    setSnake(STARTING_SNAKE);
    setFood(STARTING_FOOD);
    setScore(0);
    setStatus("playing");
  }, []);

  const changeDirection = useCallback(
    (nextDirection: Direction) => {
      if (OPPOSITE[directionRef.current] === nextDirection) return;
      directionRef.current = nextDirection;
      if (status === "ready" || status === "paused") setStatus("playing");
    },
    [status],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const nextDirection = directionKeys[event.key];
      if (nextDirection) {
        event.preventDefault();
        changeDirection(nextDirection);
      }
      if (event.key === " " || event.key === "p" || event.key === "P") {
        event.preventDefault();
        setStatus((current) =>
          current === "playing" ? "paused" : current === "paused" ? "playing" : current,
        );
      }
      if (event.key === "Enter" && (status === "ready" || status === "gameover")) startGame();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection, startGame, status]);

  useEffect(() => {
    if (status !== "playing") return;

    const timer = window.setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const activeDirection = directionRef.current;
        const nextHead = {
          x: head.x + (activeDirection === "right" ? 1 : activeDirection === "left" ? -1 : 0),
          y: head.y + (activeDirection === "down" ? 1 : activeDirection === "up" ? -1 : 0),
        };
        const ateFood = isSamePoint(nextHead, food);
        const bodyToCheck = ateFood ? currentSnake : currentSnake.slice(0, -1);
        const hitWall =
          nextHead.x < 0 || nextHead.x >= GRID_SIZE || nextHead.y < 0 || nextHead.y >= GRID_SIZE;
        const hitSelf = bodyToCheck.some((segment) => isSamePoint(segment, nextHead));

        if (hitWall || hitSelf) {
          setStatus("gameover");
          return currentSnake;
        }

        const nextSnake = [nextHead, ...bodyToCheck];
        if (ateFood) {
          const nextScore = score + 10;
          setScore(nextScore);
          if (nextScore > bestScore) {
            setBestScore(nextScore);
            window.localStorage.setItem("snake-best-score", String(nextScore));
          }
          setFood(createFood(nextSnake));
        }
        return nextSnake;
      });
    }, Math.max(90, 175 - score * 2));

    return () => window.clearInterval(timer);
  }, [bestScore, food, score, status]);

  const statusLabel =
    status === "ready" ? "Ready to play" : status === "paused" ? "Game paused" : status === "gameover" ? "Game over" : "In motion";
  const isOverlayVisible = status !== "playing";

  return (
    <main className="game-shell">
      <header className="topbar">
        <a className="brand" href="#game" aria-label="Snake home">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span>snake<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-note"><span className="live-dot" /> arcade mode <span className="topbar-divider" /> v1.0</div>
      </header>

      <section className="game-layout" id="game" aria-label="Snake game">
        <div className="intro-copy">
          <p className="eyebrow">Classic / 001</p>
          <h1>Stay sharp.<br /><em>Keep moving.</em></h1>
          <p className="intro-description">A focused take on the timeless arcade classic. Eat, grow, and don&apos;t hit the wall.</p>
          <div className="stat-row" aria-label="Game statistics">
            <div className="stat"><span className="stat-label">Score</span><strong>{String(score).padStart(4, "0")}</strong></div>
            <div className="stat"><span className="stat-label">Best</span><strong>{String(bestScore).padStart(4, "0")}</strong></div>
          </div>
        </div>

        <div className="game-column">
          <div className="board-wrap">
            <div className="board-status"><span className={`status-pip ${status}`} /> {statusLabel}</div>
            <div className="game-board" role="img" aria-label={`Snake board. Score ${score}. ${statusLabel}.`}>
              {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
                const point = { x: index % GRID_SIZE, y: Math.floor(index / GRID_SIZE) };
                const snakeIndex = snake.findIndex((segment) => isSamePoint(segment, point));
                const isFood = isSamePoint(food, point);
                return <span key={`${point.x}-${point.y}`} className={`cell ${snakeIndex === 0 ? "snake-head" : snakeIndex > 0 ? "snake-body" : isFood ? "food" : ""}`} />;
              })}
              {isOverlayVisible && (
                <div className="board-overlay">
                  <span className="overlay-kicker">{status === "gameover" ? "Run complete" : "Ready when you are"}</span>
                  <h2>{status === "paused" ? "Take a breath" : status === "gameover" ? `Score ${score}` : "Find your flow"}</h2>
                  <button className="primary-button" onClick={startGame}>{status === "gameover" ? "Play again" : status === "paused" ? "Resume" : "Start game"}<span aria-hidden="true">↗</span></button>
                  <span className="overlay-hint">or press enter</span>
                </div>
              )}
            </div>
          </div>
          <div className="game-footer">
            <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move</span>
            <span><kbd>SPACE</kbd> to pause</span>
          </div>
        </div>

        <aside className="controls-panel" aria-label="Game controls">
          <div className="panel-heading"><span className="eyebrow">Controls</span><span className="control-index">01 / 02</span></div>
          <div className="d-pad" aria-label="Directional controls">
            <button aria-label="Move up" className="d-pad-button up" onClick={() => changeDirection("up")}>↑</button>
            <button aria-label="Move left" className="d-pad-button left" onClick={() => changeDirection("left")}>←</button>
            <button aria-label="Move down" className="d-pad-button down" onClick={() => changeDirection("down")}>↓</button>
            <button aria-label="Move right" className="d-pad-button right" onClick={() => changeDirection("right")}>→</button>
          </div>
          <div className="panel-divider" />
          <button className="reset-button" onClick={startGame}><span aria-hidden="true">↻</span> Reset run</button>
          <p className="panel-tip">Your best score is saved<br />locally on this device.</p>
        </aside>
      </section>

      <footer className="page-footer"><span>Built for the joy of simple things.</span><span>Use your arrow keys or WASD <span className="footer-arrow">↗</span></span></footer>
    </main>
  );
}
