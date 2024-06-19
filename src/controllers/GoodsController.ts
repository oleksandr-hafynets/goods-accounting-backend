import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import { db } from "../app";
import { IGoods } from "../types";

export const createGood = async (req: Request, res: Response) => {
  const { title, description, price, count, image, category } =
    req.body as IGoods;

  if (!title || !price || !count || !image || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const sql = `
      INSERT INTO GOODS (title, description, price, count, image, category) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [data] = await db.query(sql, [
      title,
      description,
      price,
      count,
      image,
      category,
    ]);

    const info = data as ResultSetHeader;
    res.status(201).json({ message: "Good created", id: info.insertId });
  } catch (error) {
    console.error("Error creating good:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all goods
export const getAllGoods = async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM GOODS");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching goods:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single good by ID
export const getGoodById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM GOODS WHERE id = ?", [id]);
    const goods = rows as IGoods[];

    if (!goods.length) {
      return res.status(404).json({ message: "Good not found" });
    }

    res.status(200).json(goods[0]);
  } catch (error) {
    console.error("Error fetching good:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a good
export const updateGood = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, price, count, image, category } =
    req.body as IGoods;

  if (!title || !price || !count || !image || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const sql = `
      UPDATE GOODS SET title = ?, description = ?, price = ?, count = ?, image = ?, category = ? 
      WHERE id = ?
    `;
    const [result] = await db.query(sql, [
      title,
      description,
      price,
      count,
      image,
      category,
      id,
    ]);

    const info = result as ResultSetHeader;

    if (info.affectedRows === 0) {
      return res.status(404).json({ message: "Good not found" });
    }

    res.status(200).json({ message: "Good updated" });
  } catch (error) {
    console.error("Error updating good:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a good
export const deleteGood = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM GOODS WHERE id = ?", [id]);

    const info = result as ResultSetHeader;

    if (info.affectedRows === 0) {
      return res.status(404).json({ message: "Good not found" });
    }

    res.status(200).json({ message: "Good deleted" });
  } catch (error) {
    console.error("Error deleting good:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
