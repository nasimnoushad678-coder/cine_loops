import { useEffect, useState } from "react";
import API from "../services/api";

export default function TheaterDashboard() {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);

  const [movieForm, setMovieForm] = useState({
    title: "",
    description: "",
    duration: ""
  });

  const [showForm, setShowForm] = useState({
    movie: "",
    show_time: "",
    total_seats: "",
    price: ""
  });

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await API.get("/movies/");
      setMovies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchShows = async (movieId) => {
    try {
      const res = await API.get(`/shows/${movieId}/`);
      setShows(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // ADD MOVIE
  // =========================
  const handleAddMovie = async () => {
    try {
      await API.post("/movies/create/", {
        ...movieForm,
        duration: Number(movieForm.duration)
      });

      alert("Movie added ✅");
      setMovieForm({ title: "", description: "", duration: "" });
      fetchMovies();
    } catch (err) {
      console.log(err.response?.data);
      alert("Error adding movie ❌");
    }
  };

  // =========================
  // CREATE SHOW
  // =========================
  const handleCreateShow = async () => {
    try {
      const payload = {
        movie: Number(showForm.movie),
        show_time: new Date(showForm.show_time).toISOString(),
        total_seats: Number(showForm.total_seats),
        price: Number(showForm.price),
      };

      await API.post("/shows/create/", payload);

      alert("Show created 🎭");
      setShowForm({
        movie: "",
        show_time: "",
        total_seats: "",
        price: ""
      });

    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert("Error creating show ❌");
    }
  };

  // =========================
  // DELETE SHOW
  // =========================
  const handleDeleteShow = async (id) => {
    try {
      await API.delete(`/shows/delete/${id}/`);
      alert("Show deleted ❌");
      fetchMovies();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: "20px" }}>
      <h1>Theater Dashboard 🎭</h1>

      {/* ================= ADD MOVIE ================= */}
      <div style={card}>
        <h2>Add Movie 🎬</h2>

        <input
          placeholder="Title"
          value={movieForm.title}
          onChange={e => setMovieForm({ ...movieForm, title: e.target.value })}
        />

        <input
          placeholder="Description"
          value={movieForm.description}
          onChange={e => setMovieForm({ ...movieForm, description: e.target.value })}
        />

        <input
          type="number"
          placeholder="Duration (mins)"
          value={movieForm.duration}
          onChange={e => setMovieForm({ ...movieForm, duration: e.target.value })}
        />

        <button onClick={handleAddMovie}>Add Movie</button>
      </div>

      {/* ================= CREATE SHOW ================= */}
      <div style={card}>
        <h2>Create Show 🎭</h2>

        <select
          value={showForm.movie}
          onChange={e => setShowForm({ ...showForm, movie: e.target.value })}
        >
          <option value="">Select Movie</option>
          {movies.map(m => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={showForm.show_time}
          onChange={e => setShowForm({ ...showForm, show_time: e.target.value })}
        />

        <input
          type="number"
          placeholder="Seats"
          value={showForm.total_seats}
          onChange={e => setShowForm({ ...showForm, total_seats: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price"
          value={showForm.price}
          onChange={e => setShowForm({ ...showForm, price: e.target.value })}
        />

        <button onClick={handleCreateShow}>Create Show</button>
      </div>

      {/* ================= MOVIES ================= */}
      <div style={card}>
        <h2>My Movies 🎬</h2>

        {movies.map(m => (
          <div key={m.id} style={item}>
            <h3>{m.title}</h3>
            <p>{m.description}</p>

            <button onClick={() => fetchShows(m.id)}>
              View Shows
            </button>
          </div>
        ))}
      </div>

      {/* ================= SHOWS ================= */}
      <div style={card}>
        <h2>Shows 🎭</h2>

        {shows.map(s => (
          <div key={s.id} style={item}>
            <p>🕒 {new Date(s.show_time).toLocaleString()}</p>
            <p>💺 {s.available_seats} seats</p>
            <p>💰 ₹{s.price}</p>

            <button onClick={() => handleDeleteShow(s.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================= STYLES =================
const card = {
  border: "1px solid #ccc",
  padding: "15px",
  marginBottom: "20px",
  borderRadius: "10px"
};

const item = {
  borderBottom: "1px solid #eee",
  padding: "10px 0"
};