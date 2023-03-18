import type { NextPage } from "next";
import { useState } from "react";
import { TextField, Button, Typography, Container, Box, CircularProgress } from "@mui/material";

const Home: NextPage = () => {
  const [artist, setArtist] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLocationSubmit = async () => {
    if (locationInput) {
      try {
        setLoading(true);
        const response = await fetch(`/api/closest-band?location=${encodeURIComponent(locationInput)}`);
        const data = await response.json();

        if (response.ok) {
          setArtist(data.artist);
          setError(null);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("An error occurred while fetching the closest band." + err);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter a location.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find the Closest Band
        </Typography>
        <TextField
          fullWidth
          label="Location"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLocationSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Find Closest Band"}
          </Button>
        </Box>
        {artist && (
          <Typography variant="h6" component="h2" gutterBottom>
            Closest Band: {artist}
          </Typography>
        )}
        {error && (
          <Typography variant="body1" component="p" color="error">
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Home;
