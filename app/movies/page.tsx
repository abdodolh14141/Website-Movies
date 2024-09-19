"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Link from "next/link";

const Movies = () => {
  const [movies, setMovies] = useState([]); // State to store movies
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors
  const [page, setPage] = useState(1); // State to manage current page

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true); // Start loading before the fetch begins
      try {
        const response = await axios.get(
          `https://yts.mx/api/v2/list_movies.json?page=${page}&limit=50`
        );
        if (response.status === 200 && response.data.data.movies) {
          setMovies(response.data.data.movies); // Correctly access movies array
          toast.success("Movies fetched successfully");
        } else {
          setError("No movies found");
          toast.error("No movies found");
        }
      } catch (error) {
        setError("Error fetching data");
        toast.error("Error fetching data");
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false); // Ensure loading is false after fetch
      }
    };

    fetchMovies();
  }, [page]); // Include `page` in the dependency array to fetch new data on page change

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <Toaster />
      <div className="header flex justify-center items-center">
        <h1 className="text-4xl font-bold text-center mb-8">
          <img
            width={100}
            src="data:image/png;base64,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"
          />
        </h1>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {movies.length > 0 ? (
        <div className="movies-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link href={`/movies/${movie.id}`} passHref key={movie.id}>
              <div className="movie-card bg-white w-full rounded-lg shadow-lg p-2 flex flex-col justify-between items-center transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <img
                  src={movie.medium_cover_image}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold mb-2 text-center">
                  {movie.title}
                </h2>
                <p className="text-sm text-gray-700 mb-1">
                  Rating: {movie.rating} / 10
                </p>
                <p className="text-sm text-gray-500 mb-3">{movie.year}</p>
                <p className="text-sm text-gray-600 text-center line-clamp-3">
                  {movie.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center">No movies available.</p>
      )}
      <div className="buttons flex justify-center mt-8">
        {/* Pagination buttons */}
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)} // Use onClick to change page
            className={`bg-blue-500 text-white rounded-md px-4 py-2 mx-1 ${
              page === num ? "bg-blue-700" : "bg-blue-500"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Movies;
