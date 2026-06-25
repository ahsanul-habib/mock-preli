import "dotenv/config";
import express, { Application, Request, Response } from "express";
import SortTicketRouter from "./routes/sort-ticket.routes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/sort-ticket", SortTicketRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Server is running smoothly 🚀" });
});

app.listen(PORT, () => {
  // console.log(`Server is running on http://localhost:${PORT}`);
});
