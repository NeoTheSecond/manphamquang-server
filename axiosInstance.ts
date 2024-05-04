import axios from "axios";
// import "dotenv/config";
require("dotenv").config();

const instance = axios.create({
  // .. other options

  baseURL: "https://api.cloudinary.com/v1_1/giaphatocphamphu/image/upload",
  headers: {
    //  Authorization: `<Your Auth Token>`,
    "Content-Type": "multipart/form-data",
    timeout: 1000,
  },
});

const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
console.log(uploadPreset);

function uploadImage(file: Blob) {
  var formData = new FormData();
  // var imageFile = event.target.files![0];
  formData.append("file", file);
  formData.append("timestamp", Date.now().toString());
  formData.append("api_key", process.env.CLOUDINARY_API_KEY);
  formData.append("upload_preset", uploadPreset);
  return instance.request({ method: "post", data: formData });
}

export { uploadImage };
