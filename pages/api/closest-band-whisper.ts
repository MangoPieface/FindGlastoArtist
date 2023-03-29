import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  band: string;
  year: string;
  town: string;
  stage: string;
  distance: number;
  link: string;
  fact: string;
};

type ErrorMessage = {
  message: string;
}

const configuration = new Configuration({
  organization: process.env.OPENAP_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorMessage>
) {

  if (!configuration.apiKey) {
    const error = new Error("OpenAI API key not configured");
    return res.status(500).json({ message: "An error occurred while processing your request." + error });
  }

  const location = req.query.location?.toString() || "";
  if (location.trim().length === 0) {
    return res.status(400).json({ message: "Please enter a valid location" });
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      prompt: generatePrompt(location),
    });

    console.log("yo yo " + String(completion.data.choices[0].text));
    const data = JSON.parse(String(completion.data.choices[0].text)) as Data;
  
    return res.status(200).json(data);

  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({ message: "An error occurred during your request." });
    }
  }
}

function generatePrompt(location: string): string {

  const prompt = `A JSON file that returns a random band from ${location} or near ${location} that played any stage for the Glastonbury festival.
  Add year they played, the town the band is from, the stage, distance in miles from location a link to a known Spotify artist page and an interesting fact about their performance.`
  console.log(prompt);
  return prompt;
}

