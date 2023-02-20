import type { Request, Response } from "express";
import axios from "axios";
import url from "url";

export async function refreshSpotifyToken(req: Request, res: Response) {
  var refresh_token = req.query.refresh_token;
  if (typeof refresh_token !== "string") {
    // throw new Error("must provide refresh_token");
    res.status(500);
    return res.json({ error: "must provide refresh_token" });
  }

  // let bodyFormData = new FormData();
  // bodyFormData.append("grant_type", "refresh_token");
  // bodyFormData.append("refresh_token", refresh_token);
  // const params = new URLSearchParams({
  //   grant_type: "refresh_token",
  //   refresh_token: refresh_token,
  // });

  const data = {
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  };

  const params = new url.URLSearchParams(data);

  var axiosOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token/",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "content-type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  axios(axiosOptions)
    .then((response) => {
      if (response.status === 200) {
        var access_token = response.data.access_token;
        res.send({
          access_token: access_token,
        });
      }
    })
    .catch((err) => {
      console.log();
      res.json(err.response.data);
    });
}
