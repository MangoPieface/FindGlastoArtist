import type { NextApiRequest, NextApiResponse } from "next";
import artists from "../../lib/artists";
import * as geolib from "geolib";


type Data = {
  artist: string;
  town: string;
  country: string;
  latitude: number;
  longitude: number;
  spotify: string;
};

type ErrorMessage = {
    message: string;
}

//const OPEN_CAGE_API_KEY = "YOUR_OPEN_CAGE_API_KEY";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorMessage>
) {
  try {
    const location = req.query.location as string;

    const getLocationData = async (location: string): Promise<{ lat: number; lng: number }> => {
        const apiKey = process.env.OPENCAGE_API_KEY;
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${process.env.OPEN_CAGE_API_KEY}`;
      
        const response = await fetch(url);
        const data = await response.json();
      
        if (!data.results || data.results.length === 0) {
          throw new Error("Location not found");
        }
      
        return {
          lat: data.results[0].geometry.lat,
          lng: data.results[0].geometry.lng,
        };
      };

      const latLongLocation = await getLocationData(location);

    console.log('latlong ' + latLongLocation.lat + '  ' + latLongLocation.lng);
 
    const userLocation = {
      latitude: latLongLocation.lat,
      longitude: latLongLocation.lng,
    };

    console.log('user location ' + userLocation + ' fff '+ artists[0].latitude);
 

    // Find the closest band
    const distances = artists.map(artist => ({
      a: console.log(artist.artist + artist.latitude + ' ' + artist.longitude + ' ' + geolib),
      index: artists.indexOf(artist),
      distance: geolib.getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: artist.latitude, longitude: artist.longitude }
      ),
    }));

    distances.sort((a, b) => a.distance - b.distance);
    const closestBand = artists[distances[0].index];

    res.status(200).json(closestBand);
  } catch (error) {
    console.error('test ' + error);
    res.status(500).json({ message: "An error occurred while processing your request." + error});
  }
};
