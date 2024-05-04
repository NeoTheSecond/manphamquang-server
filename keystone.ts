/*
Welcome to Keystone! This file is what keystone uses to start the app.

It looks at the default export, and expects a Keystone config object.

You can find all the config options in our docs here: https://keystonejs.com/docs/apis/config
*/

import { config } from "@keystone-6/core";
import "dotenv/config";

// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI
import { lists } from "./schema";

// Keystone auth is configured separately - check out the basic auth setup we are importing from our auth file.
import { withAuth, session } from "./auth";
import { refreshSpotifyToken } from "./routes/refreshSpotifyToken";
import callback from "./routes/callback";
import { loginSpotify } from "./routes/loginSpotify";
import { uploadImageToCloudinary } from "./routes/uploadImageToCloudinary";

var fileUpload = require("express-fileupload");
var cookieParser = require("cookie-parser");

export default withAuth(
  // Using the config function helps typescript guide you to the available options.
  config({
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
      enableLogging: true,
      idField: { kind: "uuid" },
    },
    server: {
      port: process.env.PORT || 3001,
      cors: {
        origin: [
          "http://localhost:3001",
          "http://localhost:3000",
          /\.?manphamquang(.*)\.com/,
          /\.?manphamquang-legacy(.*)\.vercel\.app/,
        ],
        credentials: true,
      },
      extendExpressApp(app, context) {
        app.use(cookieParser());
        app.use(fileUpload());
        app.use("/spotify", async (req, res, next) => {
          /*
          WARNING: normally if you're adding custom properties to an
          express request type, you might extend the global Express namespace...
          ... we're not doing that here because we're in a Typescript monorepo
          so we're casting the request instead :)
        */
          (req as any).context = await context.withRequest(req, res);
          next();
        });

        app.use("/upload_document_image", async (req, res, next) => {
          (req as any).context = await context.withRequest(req, res);
          next();
        });

        app.get("/login", loginSpotify);
        app.get("/spotify/callback", callback);
        app.get("/spotify/refresh_spotify_token", refreshSpotifyToken);
        app.post("/upload_document_image", uploadImageToCloudinary);
      },
    },
    images: {
      upload: "local",
      local: {
        storagePath: "public/images",
        baseUrl: "/images",
      },
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session,
  })
);
