import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    API.get("/movies/").then(res => setMovies(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>CineLoops 🎬</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        {movies.map(movie => (
          <div key={movie.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "10px" }}>
            <h3>{movie.title}</h3>
            <p>{movie.description}</p>
            <Link to={`/shows/${movie.id}`}>View Shows</Link>
          </div>
        ))}
      </div>
    </div>
  );
}