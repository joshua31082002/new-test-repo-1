'use client';

import { useEffect, useMemo, useState } from 'react';

type GameId =
  | 'tic-tac-toe'
  | 'snake-ladder'
  | 'memory'
  | '2048'
  | 'minesweeper'
  | 'scramble'
  | 'sliding'
  | 'sudoku'
  | 'simon'
  | 'lights-out';
type Category = 'All games' | 'Quick play' | 'Puzzle' | 'Brainy';

type Game = {
  id: GameId;
  name: string;
  description: string;
  category: Exclude<Category, 'All games'>;
  level: string;
  accent: string;
  mark: string;
};

const games: Game[] = [
  { id: 'tic-tac-toe', name: 'Tic-Tac-Toe', description: 'Outsmart the sunny-side AI.', category: 'Quick play', level: 'Easy', accent: 'coral', mark: 'XO' },
  { id: 'snake-ladder', name: 'Snake & Ladder', description: 'Roll, climb, and dodge the slides.', category: 'Quick play', level: 'Easy', accent: 'mint', mark: '100' },
  { id: 'memory', name: 'Memory Match', description: 'Find every pair before the timer does.', category: 'Brainy', level: 'Easy', accent: 'lilac', mark: '2×' },
  { id: '2048', name: '2048', description: 'Slide smart. Merge brilliantly.', category: 'Brainy', level: 'Medium', accent: 'sun', mark: '2K' },
  { id: 'minesweeper', name: 'Minesweeper', description: 'Clear the board without a misstep.', category: 'Brainy', level: 'Medium', accent: 'sky', mark: '!' },
  { id: 'scramble', name: 'Word Scramble', description: 'Untangle a word in record time.', category: 'Puzzle', level: 'Easy', accent: 'lemon', mark: 'ABC' },
  { id: 'sliding', name: 'Sliding Puzzle', description: 'One space. Endless possibilities.', category: 'Puzzle', level: 'Medium', accent: 'peach', mark: '15' },
  { id: 'sudoku', name: 'Sudoku Mini', description: 'A tiny grid for a big brain win.', category: 'Brainy', level: 'Medium', accent: 'blue', mark: '4×4' },
  { id: 'simon', name: 'Simon Says', description: 'Watch the pattern. Repeat the beat.', category: 'Quick play', level: 'Medium', accent: 'lavender', mark: 'GO' },
  { id: 'lights-out', name: 'Lights Out', description: 'Turn every tile off to win.', category: 'Puzzle', level: 'Medium', accent: 'teal', mark: 'ON' },
];

const categories: Category[] = ['All games', 'Quick play', 'Puzzle', 'Brainy'];

function Button({ children, onClick, variant = 'primary', type = 'button' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; type?: 'button' | 'submit' }) {
  return <button type={type} onClick={onClick} className={`button button-${variant}`}>{children}</button>;
}

function GameCard({ game, onPlay, featured = false }: { game: Game; onPlay: () => void; featured?: boolean }) {
  return (
    <article className={`game-card accent-${game.accent} ${featured ? 'game-card-featured' : ''}`}>
      <button className="game-card-click" onClick={onPlay} aria-label={`Play ${game.name}`}>
        <span className="game-mark">{game.mark}</span>
        <span className="game-card-body">
          <span className="eyebrow">{game.category}</span>
          <strong>{game.name}</strong>
          <span className="game-description">{game.description}</span>
        </span>
        <span className="play-arrow" aria-hidden="true">↗</span>
      </button>
      <span className="game-meta"><span>{game.level}</span><span>Solo play</span></span>
    </article>
  );
}

function GameFrame({ game, onBack, children }: { game: Game; onBack: () => void; children: React.ReactNode }) {
  return (
    <section className={`play-frame accent-${game.accent}`} aria-label={`${game.name} game`}>
      <div className="play-frame-top"><button className="back-button" onClick={onBack}>← Back to games</button><span className="eyebrow">{game.category} / {game.level}</span></div>
      <div className="play-frame-heading"><div><p className="eyebrow">Now playing</p><h2>{game.name}</h2><p>{game.description}</p></div><span className="game-mark large-mark">{game.mark}</span></div>
      {children}
    </section>
  );
}

function Status({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'success' | 'danger' }) {
  return <div className={`status status-${tone}`} role="status">{children}</div>;
}

function TicTacToe() {
  const empty = Array(9).fill(null) as (string | null)[];
  const [board, setBoard] = useState(empty);
  const [message, setMessage] = useState('Your move — you are X');
  const winner = getWinner(board);
  const play = (index: number) => {
    if (board[index] || winner || message.includes('Thinking')) return;
    const next = [...board]; next[index] = 'X'; setBoard(next);
    if (getWinner(next) || next.every(Boolean)) { setMessage(getWinner(next) ? 'You got three — brilliant!' : 'A tidy draw.'); return; }
    setMessage('Thinking…');
    const open = next.map((value, i) => value ? -1 : i).filter((value) => value >= 0);
    window.setTimeout(() => { const ai = open[Math.floor(Math.random() * open.length)]; const after = [...next]; after[ai] = 'O'; setBoard(after); setMessage(getWinner(after) ? 'The sunny AI wins this round.' : after.every(Boolean) ? 'A tidy draw.' : 'Your move — you are X'); }, 420);
  };
  return <div className="game-stack"><Status tone={winner === 'X' ? 'success' : winner === 'O' ? 'danger' : 'neutral'}>{winner ? (winner === 'X' ? 'Victory!' : 'Try another angle.') : message}</Status><div className="ttt-grid">{board.map((cell, index) => <button key={index} className={`ttt-cell ${cell === 'X' ? 'x' : 'o'}`} onClick={() => play(index)} aria-label={`Square ${index + 1}${cell ? `, ${cell}` : ''}`}>{cell}</button>)}</div><Button variant="secondary" onClick={() => { setBoard(empty); setMessage('Your move — you are X'); }}>Reset round</Button></div>;
}

function SnakeLadder() {
  const [player, setPlayer] = useState(1); const [computer, setComputer] = useState(1); const [turn, setTurn] = useState<'player' | 'computer'>('player'); const [die, setDie] = useState(0); const [message, setMessage] = useState('Roll the die to start your climb.');
  const roll = () => { if (turn !== 'player' || player >= 100) return; const value = Math.ceil(Math.random() * 6); const next = Math.min(100, player + value); const slide = ({ 14: 4, 33: 9, 46: 25, 52: 11, 61: 18, 72: 54, 84: 63, 91: 73 } as Record<number, number>)[next]; const landed = slide ?? next; setDie(value); setPlayer(landed); if (landed === 100) { setMessage('You reached the top first!'); return; } setMessage(`You rolled ${value}. The computer is thinking…`); setTurn('computer'); window.setTimeout(() => { const compRoll = Math.ceil(Math.random() * 6); const compNext = Math.min(100, computer + compRoll); const compLanded = ({ 14: 4, 33: 9, 46: 25, 52: 11, 61: 18, 72: 54, 84: 63, 91: 73 } as Record<number, number>)[compNext] ?? compNext; setComputer(compLanded); setTurn('player'); setMessage(compLanded === 100 ? 'The computer reached 100. Roll again to bounce back.' : `Computer rolled ${compRoll}. Your turn.`); }, 500); };
  return <div className="game-stack"><Status tone={player === 100 ? 'success' : 'neutral'}>{message}</Status><div className="race-board"><div className="race-track">{[100, 91, 82, 73, 64, 55, 46, 37, 28, 19, 10].map((value) => <span key={value} className="race-rung"><b>{value}</b>{player === value && <i className="token token-player" />} {computer === value && <i className="token token-computer" />}</span>)}</div><div className="race-side"><span className="eyebrow">Last roll</span><strong>{die || '—'}</strong><span className="token-label"><i className="token token-player" /> You {player}</span><span className="token-label"><i className="token token-computer" /> CPU {computer}</span></div></div><Button onClick={roll}>{player === 100 ? 'Play again' : turn === 'player' ? 'Roll the die' : 'Computer turn…'}</Button><Button variant="secondary" onClick={() => { setPlayer(1); setComputer(1); setTurn('player'); setDie(0); setMessage('Roll the die to start your climb.'); }}>Reset board</Button></div>;
}

function MemoryMatch() {
  const [cards, setCards] = useState(() => shuffle(['sun', 'sun', 'moon', 'moon', 'star', 'star', 'cloud', 'cloud'])); const [flipped, setFlipped] = useState<number[]>([]); const [matched, setMatched] = useState<number[]>([]); const [moves, setMoves] = useState(0);
  useEffect(() => { if (flipped.length !== 2) return; const [a, b] = flipped; const timer = window.setTimeout(() => { setMoves((value) => value + 1); if (cards[a] === cards[b]) { setMatched((value) => [...value, a, b]); setFlipped([]); } else setFlipped([]); }, cards[a] === cards[b] ? 0 : 700); return () => window.clearTimeout(timer); }, [flipped, cards]);
  const reset = () => { setCards(shuffle(['sun', 'sun', 'moon', 'moon', 'star', 'star', 'cloud', 'cloud'])); setFlipped([]); setMatched([]); setMoves(0); };
  return <div className="game-stack"><Status tone={matched.length === 8 ? 'success' : 'neutral'}>{matched.length === 8 ? `All matched in ${moves} moves!` : `${matched.length / 2} of 4 pairs found · ${moves} moves`}</Status><div className="memory-grid">{cards.map((card, index) => { const shown = flipped.includes(index) || matched.includes(index); return <button key={index} className={`memory-card ${shown ? 'shown' : ''} ${matched.includes(index) ? 'matched' : ''}`} onClick={() => !shown && flipped.length < 2 && setFlipped((value) => [...value, index])} aria-label={shown ? card : 'Hidden card'}>{shown ? card : '?'}</button>; })}</div><Button variant="secondary" onClick={reset}>Shuffle cards</Button></div>;
}

function Game2048() {
  const [tiles, setTiles] = useState<number[]>(() => addTile(addTile(Array(16).fill(0)))); const [score, setScore] = useState(0);
  const move = (direction: 'left' | 'right' | 'up' | 'down') => { const rows = Array.from({ length: 4 }, (_, r) => tiles.slice(r * 4, r * 4 + 4)); const line = (row: number[]) => { const values = row.filter(Boolean); for (let i = 0; i < values.length - 1; i++) if (values[i] === values[i + 1]) { values[i] *= 2; setScore((s) => s + values[i]); values.splice(i + 1, 1); } return [...values, ...Array(4 - values.length).fill(0)]; }; let next = rows.map((row) => line(row)); if (direction === 'right') next = rows.map((row) => line([...row].reverse()).reverse()); if (direction === 'up' || direction === 'down') { const cols = Array.from({ length: 4 }, (_, c) => rows.map((row) => row[c])); const built = cols.map((col) => direction === 'down' ? line([...col].reverse()).reverse() : line(col)); next = rows.map((_, r) => built.map((col) => col[r])); } const flat = next.flat(); if (flat.some((value, i) => value !== tiles[i])) setTiles(addTile(flat)); };
  useEffect(() => { const handler = (event: KeyboardEvent) => { const map: Record<string, 'left' | 'right' | 'up' | 'down'> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }; if (map[event.key]) { event.preventDefault(); move(map[event.key as keyof typeof map]); } }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); });
  return <div className="game-stack"><Status>Score {score} · Use arrows or the buttons</Status><div className="tile-board">{tiles.map((tile, index) => <span key={index} className={`tile tile-${tile}`}>{tile || ''}</span>)}</div><div className="direction-pad"><Button variant="secondary" onClick={() => move('up')}>↑</Button><Button variant="secondary" onClick={() => move('left')}>←</Button><Button variant="secondary" onClick={() => move('down')}>↓</Button><Button variant="secondary" onClick={() => move('right')}>→</Button></div><Button variant="secondary" onClick={() => { setTiles(addTile(addTile(Array(16).fill(0)))); setScore(0); }}>New grid</Button></div>;
}

function Minesweeper() {
  const mines = [1, 7, 12, 18, 23]; const [open, setOpen] = useState<number[]>([]); const [flagged, setFlagged] = useState<number[]>([]); const hitMine = open.some((cell) => mines.includes(cell)); const cleared = open.filter((cell) => !mines.includes(cell)).length === 20;
  return <div className="game-stack"><Status tone={hitMine ? 'danger' : cleared ? 'success' : 'neutral'}>{hitMine ? 'Boom. Reset and try a safer route.' : cleared ? 'Board cleared — nice work!' : `${open.length} tiles revealed · ${flagged.length} flagged`}</Status><div className="mine-grid">{Array.from({ length: 25 }, (_, index) => <button key={index} className={`mine-cell ${open.includes(index) ? 'open' : ''}`} onClick={() => !open.includes(index) && setOpen((value) => [...value, index])} onContextMenu={(event) => { event.preventDefault(); if (!open.includes(index)) setFlagged((value) => value.includes(index) ? value.filter((item) => item !== index) : [...value, index]); }} aria-label={`Mine tile ${index + 1}`}>{open.includes(index) ? (mines.includes(index) ? 'X' : countMines(index, mines)) : flagged.includes(index) ? 'F' : ''}</button>)}</div><Button variant="secondary" onClick={() => { setOpen([]); setFlagged([]); }}>Reset board</Button></div>;
}

function WordScramble() { const words = ['SUNSHINE', 'PUZZLE', 'RAINBOW', 'GARDEN', 'BLOSSOM']; const [index, setIndex] = useState(0); const [answer, setAnswer] = useState(''); const [message, setMessage] = useState('Unscramble the letters.'); const word = words[index]; return <div className="game-stack"><Status tone={message.startsWith('Correct') ? 'success' : message.startsWith('Not') ? 'danger' : 'neutral'}>{message}</Status><div className="scramble-word">{shuffle(word.split('')).join(' ')}</div><form className="answer-row" onSubmit={(event) => { event.preventDefault(); if (answer.toUpperCase() === word) { setMessage('Correct! Ready for another?'); } else setMessage('Not quite — try again.'); }}><input value={answer} onChange={(event) => setAnswer(event.target.value)} aria-label="Your answer" placeholder="Type the word" autoComplete="off" /><Button type="submit">Check</Button></form><Button variant="secondary" onClick={() => { setIndex((value) => (value + 1) % words.length); setAnswer(''); setMessage('New word, new chance.'); }}>Skip word</Button></div>; }

function SlidingPuzzle() { const [tiles, setTiles] = useState(() => shuffle([1, 2, 3, 4, 5, 6, 7, 8, 0])); const [moves, setMoves] = useState(0); const solved = tiles.every((tile, index) => tile === (index === 8 ? 0 : index + 1)); const tap = (index: number) => { const blank = tiles.indexOf(0); const adjacent = [blank - 1, blank + 1, blank - 3, blank + 3].includes(index); if (!adjacent) return; const next = [...tiles]; [next[blank], next[index]] = [next[index], next[blank]]; setTiles(next); setMoves((value) => value + 1); }; return <div className="game-stack"><Status tone={solved ? 'success' : 'neutral'}>{solved ? `Solved in ${moves} moves!` : `${moves} moves · Tap a tile beside the gap`}</Status><div className="slide-grid">{tiles.map((tile, index) => <button key={index} className={`slide-cell ${tile === 0 ? 'blank' : ''}`} onClick={() => tap(index)}>{tile || ''}</button>)}</div><Button variant="secondary" onClick={() => { setTiles(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 0])); setMoves(0); }}>Shuffle puzzle</Button></div>; }

function SudokuMini() { const solution = [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1]; const clues = [1, null, 3, null, null, 4, 1, null, 2, null, null, 3, null, 3, null, 1]; const [values, setValues] = useState<(number | null)[]>(clues); const complete = values.every((value, index) => value === solution[index]); const setValue = (index: number, value: string) => { const next = [...values]; next[index] = value ? Number(value) : null; setValues(next); }; return <div className="game-stack"><Status tone={complete ? 'success' : 'neutral'}>{complete ? 'Grid complete — excellent.' : 'Fill the empty squares with 1–4.'}</Status><div className="sudoku-grid">{values.map((value, index) => <input key={index} value={value ?? ''} disabled={clues[index] !== null} onChange={(event) => setValue(index, event.target.value.replace(/[^1-4]/g, '').slice(-1))} aria-label={`Sudoku square ${index + 1}`} />)}</div><Button variant="secondary" onClick={() => setValues(clues)}>Reset grid</Button></div>; }

function SimonSays() { const colors = ['coral', 'sun', 'mint', 'sky']; const [sequence, setSequence] = useState<string[]>([]); const [step, setStep] = useState(0); const [message, setMessage] = useState('Start the pattern when you are ready.'); const pickColor = (offset: number) => colors[offset % colors.length]; const start = () => { const next = [pickColor(0)]; setSequence(next); setStep(0); setMessage('Watch the pattern, then repeat it.'); }; const tap = (color: string) => { if (!sequence.length) return; if (color !== sequence[step]) { setMessage('Oops — pattern broken. Try again.'); setSequence([]); return; } if (step === sequence.length - 1) { const next = [...sequence, pickColor(sequence.length)]; setSequence(next); setStep(0); setMessage(`Round ${next.length - 1} cleared. Keep going.`); } else setStep((value) => value + 1); }; return <div className="game-stack"><Status tone={message.startsWith('Round') ? 'success' : message.startsWith('Oops') ? 'danger' : 'neutral'}>{message}</Status><div className="simon-grid">{colors.map((color) => <button key={color} className={`simon-button simon-${color}`} onClick={() => tap(color)} aria-label={`Simon ${color}`} />)}</div><Button onClick={start}>{sequence.length ? 'Restart pattern' : 'Start pattern'}</Button></div>; }

function LightsOut() { const [lights, setLights] = useState(() => Array.from({ length: 25 }, (_, i) => i % 3 === 0 || i === 12)); const on = lights.filter(Boolean).length; const toggle = (index: number) => { const next = [...lights]; [index, index - 1, index + 1, index - 5, index + 5].forEach((position) => { if (position >= 0 && position < 25 && !(position === index - 1 && index % 5 === 0) && !(position === index + 1 && index % 5 === 4)) next[position] = !next[position]; }); setLights(next); }; return <div className="game-stack"><Status tone={on === 0 ? 'success' : 'neutral'}>{on === 0 ? 'Lights out — you solved it!' : `${on} lights still on`}</Status><div className="lights-grid">{lights.map((isOn, index) => <button key={index} className={`light-cell ${isOn ? 'on' : ''}`} onClick={() => toggle(index)} aria-label={`Light ${index + 1} ${isOn ? 'on' : 'off'}`} />)}</div><Button variant="secondary" onClick={() => setLights(Array.from({ length: 25 }, (_, i) => i % 3 === 0 || i === 12))}>Reset lights</Button></div>; }

function Game({ id }: { id: GameId }) { if (id === 'tic-tac-toe') return <TicTacToe />; if (id === 'snake-ladder') return <SnakeLadder />; if (id === 'memory') return <MemoryMatch />; if (id === '2048') return <Game2048 />; if (id === 'minesweeper') return <Minesweeper />; if (id === 'scramble') return <WordScramble />; if (id === 'sliding') return <SlidingPuzzle />; if (id === 'sudoku') return <SudokuMini />; if (id === 'simon') return <SimonSays />; return <LightsOut />; }

export function ArcadeApp() { const [selected, setSelected] = useState<GameId | null>(null); const [query, setQuery] = useState(''); const [category, setCategory] = useState<Category>('All games'); const visibleGames = useMemo(() => games.filter((game) => (category === 'All games' || game.category === category) && `${game.name} ${game.description}`.toLowerCase().includes(query.toLowerCase())), [category, query]); const selectedGame = games.find((game) => game.id === selected);
  return <main className="site-shell"><nav className="topbar"><button className="brand" onClick={() => setSelected(null)} aria-label="Sunny Side Arcade home"><span className="brand-spark">+</span><span>sunny side<span>arcade</span></span></button><div className="topbar-actions"><span className="pill pill-mint">10 games ready</span><button className="nav-link" onClick={() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })}>Browse games</button></div></nav>{selected && selectedGame ? <GameFrame game={selectedGame} onBack={() => setSelected(null)}><Game id={selected} /></GameFrame> : <><section className="hero"><div className="hero-copy"><span className="eyebrow">A little play goes a long way</span><h1>Your next tiny<br /><em>win</em> is here.</h1><p>Ten bright, bite-sized games for a quick reset, a clever challenge, or a five-minute victory lap.</p><div className="hero-actions"><Button onClick={() => setSelected('tic-tac-toe')}>Play a quick game <span>↗</span></Button><span className="hero-note"><span className="mini-avatars"><i /><i /><i /></span> Loved by curious minds</span></div></div><div className="hero-art" aria-hidden="true"><div className="sun-disc" /><div className="art-card art-card-one"><span>2</span><small>moves</small></div><div className="art-card art-card-two"><span>Nice!</span><small>keep going</small></div><div className="art-squiggle">~</div><div className="art-dots" /></div></section><section className="featured-section"><div className="section-heading"><div><span className="eyebrow">Featured today</span><h2>Start with a classic</h2></div><span className="section-count">01 / 10</span></div><GameCard game={games[0]} featured onPlay={() => setSelected(games[0].id)} /></section><section className="library-section" id="library"><div className="section-heading library-heading"><div><span className="eyebrow">The game shelf</span><h2>Pick your kind of fun</h2></div><span className="section-count">{visibleGames.length} games</span></div><div className="filters"><label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games" aria-label="Search games" /></label><div className="category-tabs" role="tablist" aria-label="Filter games">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} role="tab" aria-selected={category === item}>{item}</button>)}</div></div>{visibleGames.length ? <div className="game-grid">{visibleGames.map((game) => <GameCard key={game.id} game={game} onPlay={() => setSelected(game.id)} />)}</div> : <div className="empty-state"><strong>No games found</strong><span>Try a different search or open every game.</span><Button variant="secondary" onClick={() => { setQuery(''); setCategory('All games'); }}>Clear filters</Button></div>}</section><footer className="footer"><span className="brand mini-brand"><span className="brand-spark">+</span> sunny side arcade</span><span>Made for small breaks and big smiles.</span></footer></>}</main>; }

function getWinner(board: (string | null)[]) { const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]; const line = lines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]); return line ? board[line[0]] : null; }
function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - 0.5); }
function addTile(tiles: number[]) { const next = [...tiles]; const open = next.map((value, index) => value ? -1 : index).filter((value) => value >= 0); if (open.length) next[open[Math.floor(Math.random() * open.length)]] = Math.random() > 0.9 ? 4 : 2; return next; }
function countMines(index: number, mines: number[]) { return [index - 1, index + 1, index - 5, index + 5].filter((near) => mines.includes(near)).length || ''; }

export default ArcadeApp;

