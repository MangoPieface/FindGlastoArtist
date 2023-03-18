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

type ErrorResponse = {
    message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  try {
    const userLocation = {
     latitude: parseFloat(req.query.lat as string),
     longitude: parseFloat(req.query.lng as string),
     //latitude: parseFloat("55.8642" as string),
     //longitude: parseFloat("4.2518" as string),
    };

    // Find the closest band
    const distances = artists.map(artist => ({
        index: artists.indexOf(artist),
        distance: geolib.getDistance(userLocation, {
          latitude: artist.latitude,
          longitude: artist.longitude,
        }),
      }));
      
      distances.sort((a, b) => a.distance - b.distance);
      const closestBand = artists[distances[0].index];
      
      

      res.status(200).json(closestBand);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
}
