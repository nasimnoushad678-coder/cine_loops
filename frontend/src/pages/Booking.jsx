import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_...");

export default function Booking() {
  const { id } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const totalSeats = 30;

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handlePayment = async () => {
    const res = await API.post("/payments/create-session/", {
      show: id,
      seats: selectedSeats.length,
    });

    const stripe = await stripePromise;
    stripe.redirectToCheckout({ sessionId: res.data.id });
  };

  return (
    <div>
      <h2>Select Seats 🎟</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 50px)", gap: "10px" }}>
        {[...Array(totalSeats)].map((_, i) => (
          <button
            key={i}
            onClick={() => toggleSeat(i)}
            style={{
              background: selectedSeats.includes(i) ? "green" : "gray",
              color: "white",
              height: "40px"
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <h3>Selected: {selectedSeats.length}</h3>

      <button onClick={handlePayment}>Proceed to Pay</button>
    </div>
  );
}