import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import mysql from "mysql2";

import {
  createGood,
  deleteGood,
  getAllGoods,
  getGoodById,
  updateGood,
} from "./controllers/GoodsController";
import {
  checkAuth,
  loginUser,
  registerUser,
} from "./controllers/UserController";
import { checkAdmin, verifyToken } from "./middleware";

const PORT = process.env.PORT || 5000;
const app = express();

const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

export const db = mysql.createPool(dbConfig).promise();

const corsOptions = {
  origin: process.env.ALLOWED_SITE,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// USER
app.post("/api/user/registration", registerUser);
app.post("/api/user/login", loginUser);
app.post("/api/user/check", verifyToken, checkAuth);

// GOODS
app.get("/api/goods", getAllGoods);
app.get("/api/goods/:id", getGoodById);
app.post("/api/goods", verifyToken, checkAdmin, createGood);
app.put("/api/goods/:id", verifyToken, checkAdmin, updateGood);
app.delete("/api/goods/:id", verifyToken, checkAdmin, deleteGood);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
