import { Request, Response } from "express";
import { sortTicketService } from "../services/sort-ticket.services";
import { validateRequest } from "../utils/sort-ticket";

export const sortTicket = async (req: Request, res: Response) => {
  const errors = validateRequest(req.body);

  if (errors.length) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  const result = await sortTicketService(req.body);

  return res.status(200).json(result);
};

export const healthCheck = (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
  });
};
