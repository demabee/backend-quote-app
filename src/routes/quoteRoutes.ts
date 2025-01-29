import { Router } from 'express';
import { createQuote, deleteQuote, getAllQuotes, getQuoteById, updateQuote } from '../controllers/quoteController';

const router = Router();

router.post('/quotes', createQuote);
router.get('/quotes', getAllQuotes);
router.get('/quotes/:id', getQuoteById);
router.patch('/quotes/:id', updateQuote);
router.delete('/quotes/:id', deleteQuote);

export default router;