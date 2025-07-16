import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use';
import Search from './components/search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import Watch from './components/Watch';
import Pagination from './components/Pagination'; // Import the new Pagination component
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState(''); //s1->create
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [watchingMovieId, setWatchingMovieId] = useState(null); //new
  const [trendingMovies, setTrendingMovies] = useState([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const handleWatchMovie = (id) => {  //new
    console.log('User wants to watch movie with ID:', id);
    setWatchingMovieId(id);
  };

  const handleCloseWatch = () => { //new
    console.log('Closing movie player.');
    setWatchingMovieId(null);
  };

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 400, [searchTerm])

  const fetchMovies = async (query = '', pageNum = 1) => {
    const page = typeof pageNum === 'number' && !isNaN(pageNum) ? pageNum : 1;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query ?
        `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}` //
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;  //
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch Movies');
      }
      const data = await response.json();

      if (data.response == 'False') {
        setErrorMessage(data.error || 'Failed to fetch Movies');
        setMovieList([]);
        setCurrentPage(1); // Reset page on error/no results
        setTotalPages(1); // Reset total pages on error/no results
        return;
      }

      setMovieList(data.results || []); /* update movielist with fetched data */
      setCurrentPage(data.page); // Update current page from API response
      setTotalPages(data.total_pages); // Update total pages from API response

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.log(`Error fetching movies : ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
      setMovieList([]); // Clear movie list on error
      setCurrentPage(1); // Reset page on error
      setTotalPages(1); // Reset total pages on error
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies)
    } catch (error) {
      console.log(`Error fetching Trending Movies : ${error}`);
    }
  }

  useEffect(() => {
    setCurrentPage(1); // Always reset to page 1 when search term changes
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    // Only fetch when current page changes and there's no active search term
    // If there's a search term, the debouncedSearchTerm useEffect handles the fetch.
    if (!debouncedSearchTerm) {
      fetchMovies('', currentPage); // Fetch discover movies for the current page
    } else {
      // If there's a search term, and currentPage changes, refetch search results for that page
      fetchMovies(debouncedSearchTerm, currentPage);
    }
  }, [currentPage]); // Depend on currentPage

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        {watchingMovieId ? (
          // If watchingMovieId is true, only render the Watch component
          <Watch
            movieId={watchingMovieId}
            onClose={handleCloseWatch}
          />
        ) : (
          // If watchingMovieId is null (false), render BOTH the header AND the movie list section.
          // These two must be wrapped in a single parent element (e.g., a React Fragment <>...</>).
          <>
            <header>
              <img src="./hero.png" alt="Hero banner" />
              <h1> Find <span className="text-gradient">Movies</span> You'll Enjoy</h1>
              {<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
            </header>

            {trendingMovies.length > 0 && (
              <section className='trending'>
                <h2>Trending Movies</h2>

                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="all-movies">
              <h2>All Movies</h2>

              {isLoading ? (
                <Spinner />
              ) : errorMessage ? (
                <p className='text-red-500'>{errorMessage}</p>
              ) : (
                <>
                  {movieList.length > 0 ? (
                    <ul>
                      {movieList.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} onWatchClick={handleWatchMovie} />
                      ))}
                    </ul>
                  ) : (
                    <p className='text-gray-400 text-center text-lg mt-8'>No movies found for your search.</p>
                  )}

                  {/* Render Pagination component only if there are movies and more than 1 page */}
                  {movieList.length > 0 && totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => {
                        setCurrentPage(page);
                        // Optional: Scroll to the top of the page when changing pages
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  )}
                </>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default App;
