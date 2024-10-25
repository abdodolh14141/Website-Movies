"use client";

import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { toast, Toaster } from "sonner";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Custom hook to fetch movie details
const useMovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchMovieDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`
      );

      if (response.status === 200) {
        const movieData = response.data.data.movie;
        setMovie(movieData);
      } else {
        throw new Error("Failed to fetch movie data: Invalid response status");
      }
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch movie data");
      console.error("Error fetching movie data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
    }
  }, [id, fetchMovieDetails]);

  return { movie, loading, error, reload: fetchMovieDetails };
};

export default function MoviePage() {
  const { movie, loading, error, reload } = useMovieDetails();
  const router = useRouter();

  const backWay = () => {
    router.back();
  };

  if (loading) {
    return (
      <div
        role="alert"
        aria-busy="true"
        className="flex justify-center items-center h-screen animate-pulse"
      >
        <p className="text-lg font-semibold text-gray-700">
          Loading movie details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col justify-center items-center h-screen"
      >
        <p className="text-lg text-red-500 font-semibold mb-4">{error}</p>
        <button
          onClick={reload}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-lg font-semibold">No movie data available.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-scree p-4">
      <Toaster />

      <div className="container mx-auto max-w-7xl rounded-lg shadow-lg p-6 bg-white text-black">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <h1 className="text-4xl font-bold mb-4 text-center text-gray-900">
              {movie.title}
            </h1>
            <img
              loading="lazy"
              src={movie.large_cover_image}
              alt={movie.title}
              className="w-full rounded-md shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="md:w-2/3 flex flex-col justify-between">
            <p className="text-lg text-gray-800 mb-4">
              {movie.description_full}
            </p>
            <ul className="space-y-3 text-lg">
              <li>
                <strong>Year:</strong> {movie.year}
              </li>
              <li>
                <strong>Rating:</strong> {movie.rating}
              </li>
              <li>
                <strong>Runtime:</strong> {movie.runtime} minutes
              </li>
              {movie.genres && (
                <li>
                  <strong>Genres:</strong> {movie.genres.join(", ")}
                </li>
              )}
              <li>
                <strong>Language:</strong> {movie.language}
              </li>
              <li>
                <strong>Download Count:</strong> {movie.download_count}
              </li>
              <li>
                <strong>Like Count:</strong> {movie.like_count}
              </li>
            </ul>

            <a
              href={movie.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-center bg-green-600 text-black py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
            >
              More Details
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={backWay}
            className="bg-gray-700 text-black py-2 px-6 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
          >
            <img
              src="data:image/png;base64,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"
              alt="Back"
              width={30}
              className="mr-2"
            />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
