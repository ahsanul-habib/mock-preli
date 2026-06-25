import { Router } from "express";
import {
  healthCheck,
  sortTicket,
} from "../controllers/sort-ticket.controllers";

const router = Router();

router.post("/", sortTicket);

export default router;