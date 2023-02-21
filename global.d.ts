declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    MONGO_URI: string;
    DATABASE_URL: string;
    SPOTIFY_STATE_KEY: string;
    SPOTIFY_REDIRECT_URI: string;
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_CLIENT_SECRET: string;
  }
}
