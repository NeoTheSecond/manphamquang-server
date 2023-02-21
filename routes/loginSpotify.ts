import type { Request, Response } from "express";
var querystring = require("querystring");

var generateRandomString = function (length: number) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export async function loginSpotify(req: Request, res: Response) {
  var state = generateRandomString(16);
  res.cookie(process.env.SPOTIFY_STATE_KEY, state);

  // your application requests authorization
  var scope = "user-read-private user-read-email user-read-currently-playing";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        state: state,
      })
  );
}
