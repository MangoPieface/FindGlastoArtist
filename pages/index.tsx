import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [artist, setArtist] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getClosestBand = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `/api/closest-band?lat=${latitude}&lng=${longitude}`
      );
      const data = await response.json();

      if (response.ok) {
        setArtist(data.artist);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching the closest band.");
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getClosestBand(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError("Unable to get your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <button onClick={handleGetLocation}>Get Closest Band</button>
      {artist && <h2>Closest Band: {artist}</h2>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Home;
