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
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_API_FOLDER: string;
    CLOUDINARY_UPLOAD_PRESET: string;
  }
}
