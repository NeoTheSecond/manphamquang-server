import type { Request, Response } from "express";
import { uploadImage } from "../axiosInstance";

export async function uploadImageToCloudinary(req: Request, res: Response) {
  const file = req.files.file;
  const buff = Buffer.from(file.data); // Node.js Buffer
  const blob = new Blob([buff]); // JavaScript Blob
  // console.log(file);

  const response = await uploadImage(blob);

  res.json({ success: true, data: response.data });
}
