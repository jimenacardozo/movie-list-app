---
name: html-to-react-migration
description: Use when converting HTML/JS snippets to React TSX one at a time, reviewing a user's React/TypeScript attempt for corrections, or handling TMDB API patterns (fetch, loading states, movie lists) in React with TypeScript.
---

# HTML → React Migration

## Scope

**Does:**
- Convert a single HTML snippet or JS pattern to TSX
- Review a user's React attempt and fix only what's broken
- Provide the correct React pattern for TMDB fetch calls, loading states, and movie rendering

**Does NOT:**
- Migrate full files — always one component or pattern at a time
- Make architecture or folder structure decisions
- Add custom hooks, memoization, or anything not asked for
- Explain React concepts beyond a one-line note on each fix

## HTML → TSX Quick Reference

| HTML | TSX |
|------|-----|
| `class=` | `className=` |
| `for=` | `htmlFor=` |
| `onclick="fn()"` | `onClick={fn}` |
| `onclick="fn(x)"` | `onClick={() => fn(x)}` |
| `<img src="...">` | `<img src="..." />` (self-close) |
| `style="color: red"` | `style={{ color: 'red' }}` |
| `<!-- comment -->` | `{/* comment */}` |
| Conditional in template | `{condition && <El />}` |
| Loop in template | `{arr.map(x => <El key={x.id} />)}` |


## TypeScript Basics (apply only when needed)

- Use `useState<Type | null>(null)` for single objects
- Use `useState<Type[]>([])` for lists
- Type props minimally when creating components
- Avoid over-typing — prioritize clarity over completeness

## TMDB Patterns

### Fetch + Loading State
```tsx
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(`${BASE_URL}/endpoint?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      setItems(data.results);
      setLoading(false);
    });
}, []);
```

### Render List with Loading
```tsx
{loading ? <p>Loading...</p> : items.map(item => (
  <MovieCard key={item.id} movie={item} />
))}
```

### Poster Image
```tsx
<img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
```

### Background Image (Hero)
```tsx
style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
```

---

## Examples

### 1. Movie Card — HTML to SX

**Input:**
```html
<div class="movie-card" onclick="openModal(movie)">
  <img src="https://image.tmdb.org/t/p/w500/abc.jpg">
  <p class="title">Dune</p>
</div>
```

**Output:**
```tsx
type Props = {
  movie: Movie;
  openModal: (movie: Movie) => void;
};

function MovieCard({ movie, openModal }: Props) {
  return (
    <div className="movie-card" onClick={() => openModal(movie)}>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
      <p className="title">{movie.title}</p>
    </div>
  );
}
```

---

### 2. Fetch Call — Vanilla JS to React Hook

**Input:**
```ts
fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(data => renderHero(data.results[0]));
```

**Output:**
```tsx
const [hero, setHero] = useState<Movie | null>(null);

useEffect(() => {
  fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`)
    .then(res => res.json())
    .then((data) => setHero(data.results[0]));
}, []);
```

---

### 3. Hero Section — Correct a React Attempt

**User attempt:**
```tsx
function Hero() {
  const [movie, setMovie] = useState([]);

  return (
    <div class="hero" style="background-image: url(...)">
      <h1>{movie.title}</h1>
    </div>
  );
}
```

**Fix only what's wrong:**
- `useState([])` → `useState(null)` — hero is one object, not a list
- `class=` → `className=`
- `style="..."` → `style={{ backgroundImage: 'url(...)' }}` — style takes an object, camelCase properties
