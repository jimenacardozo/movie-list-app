import fallbackPoster from '../assets/fallbackPoster.png';
import { Movie } from '../types/movie';

export default function MovieCard({ movie, genres }: {
    movie: Movie;
    genres: Record<number, string>;
}) {
    const year = movie.release_date?.split('-')[0] ?? '—';
        const posterSrc = movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : fallbackPoster;
    return (
        <div className="bg-[#0e1011] border border-[#232426] rounded-xl m-4 min-w-44 w-1/5 max-w-xs overflow-hidden">
            <div className="relative">
                <div className="absolute right-0 border border-[#232426] rounded-xl font-semibold text-[0.8rem] text-[#E57C46] bg-[#0F0C10] p-[0.3rem] m-[0.3rem]">
                    ★ {movie.vote_average.toFixed(1)}
                </div>
                <img className="w-full" src={posterSrc} alt={movie.title} loading="lazy" />
            </div>
            <h2 className="px-[0.3rem] py-[0.3rem] text-[1rem] text-white">
                {movie.title}
            </h2>
            <span className="pl-[0.3rem]">{year}</span> 
            <div className="flex flex-wrap">
                {movie.genre_ids.map((id) => (
                    <span key={id} className="text-[0.8rem] text-[#7d7d7f] border border-[#232426] rounded-xl bg-[#0e0f11] px-[0.3rem] py-[0.3rem] m-[0.3rem]">
                        {genres[id]}
                    </span>
                ))}
            </div>
        </div>
    );
}
