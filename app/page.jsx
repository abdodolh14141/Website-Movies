"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "https://yts.mx/api/v2/list_movies.json?page=2&limit=50"
        );
        if (response.status === 200) {
          setData(response.data.data.movies);
        } else {
          toast.error("Can't fetch movies");
        }
      } catch (error) {
        toast.error("Server Error: " + error.message);
      }
    };
    fetchMovies();
  }, []);

  // Auto-change movies every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (data.length - 3));
    }, 5000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [data]);

  return (
    <>
      <div className="flex max-h-screen text-center justify-around items-center opacity-95 my-3 p-6 rounded-md w-full m-auto">
        <h1 className="text-3xl p-2 text-center">
          Website Movies{" "}
          <Link
            href={"/movies"}
            className="text-3xl text-black rounded-lg p-2 font-bold hover:scale-105 transition-all hover:shadow-2xl hover:bg-yellow-950 transform"
          >
            Check It
          </Link>
        </h1>
        <img
          src="https://cdn.pixabay.com/photo/2018/01/03/01/17/film-3057394_640.jpg"
          alt="image tool movie"
          width={800}
          className="w-3/5 rounded-lg shadow-lg"
        />
      </div>
      <hr className="p-1 m-1 bg-black rounded-sm" />
      <div className="flex flex-wrap justify-center items-center w-full p-5 my-3 m-auto opacity-100 rounded-lg">
        <p className="mx-10 text-5xl text-black font-bold p-2 mb-5">
          Show Movies Action And Fact All You Want
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 w-full p-5 m-5">
          {data.slice(currentIndex, currentIndex + 5).map((movie) => (
            <Link href={`/movies/${movie.id}`} passHref key={movie.id}>
              <div
                key={movie.id}
                className="movie-card bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between items-center transform transition duration-150 hover:scale-105 hover:shadow-xl cursor-pointer"
              >
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
      </div>
    </>
  );
}
