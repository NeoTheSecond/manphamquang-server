import axios, { AxiosError } from "axios";
import type { Request, Response } from "express";
import type { Context } from ".keystone/types";
var querystring = require("querystring");

export default function callback(req: Request, res: Response) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const { context } = req as typeof req & { context: Context };

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies
    ? req.cookies[process.env.SPOTIFY_STATE_KEY]
    : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(process.env.SPOTIFY_STATE_KEY);
    var authOptions = {
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: {
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "content-type": "application/x-www-form-urlencoded",
      },
    };

    axios(authOptions)
      .then((response) => {
        if (response.status === 200) {
          var access_token: string = response.data.access_token,
            refresh_token: string = response.data.refresh_token;
          console.clear();
          console.log({ access_token, refresh_token });

          var options = {
            url: "https://api.spotify.com/v1/me",
            headers: { Authorization: "Bearer " + access_token },
            json: true,
          };

          if (access_token && refresh_token) {
            context.db.Spotify.updateOne({
              where: {
                id: "1",
              },
              data: {
                token: access_token,
                refreshToken: refresh_token,
              },
            });
          }
          //       const token = await context.query.Spotify.findOne({
          //         query: `
          // token
          // `,
          //       });

          // res.json(token);

          // use the access token to access the Spotify Web API
          // request.get(options, function (error, response, body) {
          //   console.log(body);
          // });

          // we can also pass the token to the browser to make requests from there
          // res.redirect(
          //   "/#" +
          //     querystring.stringify({
          //       access_token: access_token,
          //       refresh_token: refresh_token,
          //     })
          // );
          res.redirect("/spotify/1");
        } else {
          res.redirect(
            "/#" +
              querystring.stringify({
                error: "invalid_token",
              })
          );
        }
      })
      .catch((err: AxiosError) => {
        res.send(err);
      });

    // request.post(authOptions, function (error, response, body) {
    //   if (!error && response.statusCode === 200) {
    //     var access_token = body.access_token,
    //       refresh_token = body.refresh_token;

    //     var options = {
    //       url: "https://api.spotify.com/v1/me",
    //       headers: { Authorization: "Bearer " + access_token },
    //       json: true,
    //     };

    //     // use the access token to access the Spotify Web API
    //     request.get(options, function (error, response, body) {
    //       console.log(body);
    //     });

    //     // we can also pass the token to the browser to make requests from there
    //     res.redirect(
    //       "/#" +
    //         querystring.stringify({
    //           access_token: access_token,
    //           refresh_token: refresh_token,
    //         })
    //     );
    //   } else {
    //     res.redirect(
    //       "/#" +
    //         querystring.stringify({
    //           error: "invalid_token",
    //         })
    //     );
    //   }
    // });
  }
}
