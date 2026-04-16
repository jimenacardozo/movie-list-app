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
- Make architecture, folder structure, or naming decisions
- Add custom hooks, memoization, useCallback, or anything not asked for
- Explain React concepts beyond a one-line note on each fix

---

## HTML → TSX Quick Reference

| HTML | TSX |
|------|-----|
| `class=` | `className=` |
| `for=` | `htmlFor=` |
| `onclick="fn()"` | `onClick={fn}` |
| `onclick="fn(x)"` | `onClick={() => fn(x)}` |
| `<img src="...">` | `<img src="..." alt="description" />` — alt required |
| `style="color: red"` | `style={{ color: 'red' }}` |
| `<!-- comment -->` | `{/* comment */}` |
| Conditional | `{condition && <El />}` |
| Loop | `{arr.map(x => <El key={x.id} />)}` — key always required |

---

## TypeScript Rules (apply only when needed)

- Single object: `useState<Movie | null>(null)`
- List: `useState<Movie[]>([])`
- Type props inline, minimally — only what the component actually uses
- Avoid `any` — use `unknown` if the shape is unclear
- Avoid over-typing — clarity over completeness

### Minimal Movie type (reference)
```ts
type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
};
```

---

## TMDB Patterns

### Fetch + Loading + Error
```tsx
const [items, setItems] = useState<Movie[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetch(`${BASE_URL}/endpoint?api_key=${API_KEY}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then(data => setItems(data.results))
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, []);
```

### Render with Loading + Error
```tsx
if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

return items.map(item => <MovieCard key={item.id} movie={item} />);
```

### Poster Image
```tsx
<img
  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
  alt={movie.title}
/>
```

### Background Image (Hero)
```tsx
style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
```

---

## Examples

### 1. Movie Card — HTML to TSX

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
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <p className="title">{movie.title}</p>
    </div>
  );
}
```

---

### 2. Fetch Call — Vanilla JS to React

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
    .then(data => setHero(data.results[0]));
}, []);
```

---

### 3. Hero Section — Fix a React Attempt

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
- `useState([])` → `useState<Movie | null>(null)` — hero is one object, not a list
- `class=` → `className=`
- `style="..."` → `style={{ backgroundImage: 'url(...)' }}` — style takes an object, camelCase properties