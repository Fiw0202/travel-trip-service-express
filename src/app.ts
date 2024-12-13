import express, { Request, Response } from "express";
import axios from "axios";

const app = express();
const PORT = 8000;

const JSON_SERVER = "http://localhost:9000/trips";

interface Trip {
  title: string;
  description: string;
  tags: string[];
}

app.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json("Hello World");
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/trips", async (req: Request, res: Response): Promise<void> => {
  const { title, description, tag } = req.query;

  try {
    const response = await axios.get<Trip[]>(JSON_SERVER);
    const trips = response.data;
    if (!title && !description && !tag) {
      res.status(200).json({ trips: trips });
    } else {
      const filteredTrips = trips.filter((trip) => {
        if (title) {
          return trip.title.toLowerCase().includes(title as string);
        } else if (description) {
          return trip.description.toLowerCase().includes(description as string);
        } else if (tag) {
          return trip.tags.some((t) => t.toLowerCase().includes(tag as string));
        }
      });
      res.status(200).json({ trips: filteredTrips });
    }
  } catch (error) {
    console.error("Fetching error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
