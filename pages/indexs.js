import { useState } from "react";

export default function Home() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchFlights = async () => {
    if (!origin || !destination || !date) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/flights?origin=${origin}&destination=${destination}&date=${date}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setResults(null);
      } else {
        setResults(data);
      }
    } catch (err) {
      setError("Failed to fetch flights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Flight Search</h1>
      <div>
        <input placeholder="Origin (e.g., JFK)" value={origin} onChange={e => setOrigin(e.target.value)} />
        <input placeholder="Destination (e.g., LAX)" value={destination} onChange={e => setDestination(e.target.value)} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={searchFlights} disabled={loading}>Search</button>
      </div>

      {loading && <p>Loading flights...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {results && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Results:</h2>
          {results.flights && results.flights.length > 0 ? (
            results.flights.map((flight, index) => (
              <div key={index} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                <p><strong>Airline:</strong> {flight.airline}</p>
                <p><strong>Flight Number:</strong> {flight.flight_number}</p>
                <p><strong>Departure:</strong> {flight.departure_time}</p>
                <p><strong>Arrival:</strong> {flight.arrival_time}</p>
                <p><strong>Price:</strong> ${flight.price}</p>
              </div>
            ))
          ) : (
            <p>No flights found</p>
          )}
        </div>
      )}
    </div>
  );
}