import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Shows() {
  const { id } = useParams();
  const [shows, setShows] = useState([]);

  useEffect(() => {
    API.get(`/shows/${id}/`).then(res => setShows(res.data));
  }, []);

  return (
    <div>
      <h2>Available Shows 🎭</h2>

      {shows.map(show => (
        <div key={show.id} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
          <p>🕒 {new Date(show.show_time).toLocaleString()}</p>
          <p>💺 Seats: {show.available_seats}</p>
          <p>💰 ₹{show.price}</p>

          <Link to={`/book/${show.id}`}>
            <button>Book Now</button>
          </Link>
        </div>
      ))}
    </div>
  );
}