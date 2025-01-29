import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import sendEmail from '../services/mailer';
import { io } from '../app';


const fs = require("fs");
const path = require("path");

export const createQuote = async (req: Request, res: Response) => {
  const { recipientName, recipientEmail, details, status } = req.body;
  try {
    const newQuote = await prisma.quote.create({
      data: {
        recipientName,
        recipientEmail,
        details,
        status,
      },
    });
    // const template = await fs.readFileSync(
    //   path.resolve(__dirname, "../template/quote_client.html")
    // );

    // const body = template
    //   .toString()
    //   .replace("{link}", `${process.env.CLIENT_PUBLIC_BASE_URL}/quote/${newQuote.id}`);
    // await sendEmail(recipientEmail, 'New Quote', body, true);
    res.status(201).json(newQuote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create quote' });
  }
};

export const getAllQuotes = async (req: Request, res: Response) => {
  try {
    const quotes = await prisma.quote.findMany();
    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
};

export const getQuoteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const quote = await prisma.quote.findUnique({
      where: { id },
    });
    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
};

export const updateQuote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { recipientName, recipientEmail, details, status } = req.body;
  try {
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { recipientName, recipientEmail, details, status },
    });

    io.emit('quoteUpdated', { id, updatedQuote });
    res.json(updatedQuote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update quote' });
  }
};

export const deleteQuote = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedQuote = await prisma.quote.delete({
      where: { id },
    });
    res.json({ message: 'Quote deleted', quote: deletedQuote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
};