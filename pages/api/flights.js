export default async function handler(req, res) {
  try {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({ error: "origin, destination, and date are required" });
    }

    const response = await fetch(
      `https://api.flightapi.io/onewaytrip/${origin}/${destination}/${date}/1/0/0/Economy?apikey=${process.env.FLIGHTAPI_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
