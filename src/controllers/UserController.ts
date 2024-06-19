import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import { db } from "../app";
import { generateToken } from "../helpers/token";
import { IUser } from "../types";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role = "USER" } = req.body as IUser;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (username.length < 5) {
    return res
      .status(400)
      .json({ message: "Username must be at least 5 characters long" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM USERS WHERE username = ? OR email = ?",
      [username, email]
    );
    const users = rows as IUser[];

    if (users.length) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO USERS (username, email, password, role) VALUES (?, ?, ?, ?)";
    const [data] = await db.query(sql, [username, email, hashedPassword, role]);

    const info = data as ResultSetHeader;
    const token = generateToken({ id: info.insertId });

    res.status(200).json({ message: "User registered", token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM USERS WHERE username = ?", [
      username,
    ]);
    const users = rows as IUser[];

    if (!users.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken({ id: user.id });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ isAuth: true, message: "User is authenticated" });
};
