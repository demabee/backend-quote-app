import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import quoteRoutes from './routes/quoteRoutes';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

const prisma = new PrismaClient();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("updateQuote", (userId: string) => {
    console.log(`[Notification] User subscribed: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', quoteRoutes);

process.on('SIGINT', async () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export { io };
