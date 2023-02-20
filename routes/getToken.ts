import type { Request, Response } from "express";
import type { Context } from ".keystone/types";

export async function getSpotifyToken(req: Request, res: Response) {
  // This was added by the context middleware in ../keystone.ts
  const { context } = req as typeof req & { context: Context };
  const token = await context.query.Spotify.findOne({
    query: `
    token
    `,
  });

  res.json(token);
}
