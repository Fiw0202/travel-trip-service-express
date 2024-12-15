import express, { Request, Response } from "express";
import axios from "axios";

const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
const PORT = 8000;

const JSON_SERVER = "http://localhost:9000/trips";

interface Trip {
  title: string,
  eid: number,
  url: string,
  description: string,
  photos: string[],
  tags: string[],
  id: string
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
  const { keyword } = req.query;

  try {
    const response = await axios.get<Trip[]>(JSON_SERVER);
    const trips = response.data;

    if (!keyword || typeof keyword !== "string") {
      res.status(200).json({ trips });
    } else {
      const searchKeyword = keyword.toLowerCase();
      const filteredTrips = trips.filter((trip) => {
        const searchTitle = trip.title.toLowerCase().includes(searchKeyword);
        const searchDescription = trip.description.toLowerCase().includes(searchKeyword);
        const searchTag = trip.tags.some((tag) => tag.toLowerCase().includes(searchKeyword));
        return searchTitle || searchDescription || searchTag;
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
