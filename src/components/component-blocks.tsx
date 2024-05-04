/** @jsx */
import { jsx } from "@keystone-ui/core";
import {
  NotEditable,
  component,
  fields,
} from "@keystone-6/fields-document/component-blocks";

// import "dotenv/config";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { useEffect } from "react";
import axios from "axios";
import { uploadImage } from "../../axiosInstance";
// import { uploadImage } from "../config";
// console.log(process.env.CLOUDINARY_API_KEY);
// require("dotenv").config({ path: __dirname + "/./../../.env" });

export const componentBlocks = {
  image: component({
    preview: function Image(props) {
      return (
        <div>
          <img
            style={{ maxWidth: "300px", objectFit: "cover" }}
            src={props.fields.image.fields.imageSrc.value}
            // src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809"
          />
        </div>
      );
    },
    label: "Image",
    schema: {
      // subtitle: fields.child({ kind: "inline", placeholder: "Subtitle..." }),
      // imageSrc: fields.text({
      //   label: "Image URL",
      //   defaultValue:
      //     "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
      // }),
      // image: fields.url({
      //   label: "image",
      //   defaultValue:
      //     "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
      // }),
      image: fields.object({
        title: fields.text({ label: "Title" }),
        imageSrc: fields.url({
          label: "Image URL",
          defaultValue:
            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
        }),
        file: {
          kind: "form",
          Input(props) {
            // props.onChange()
            const handleUpload = (
              event: React.ChangeEvent<HTMLInputElement>
            ) => {
              var imageFile = event.target.files![0];
              // uploadImage(imageFile);
              // uploadImage(imageFile);
              // axios.post({})
              // var formData = new FormData();
              // var imageFile = event.target.files![0];
              // formData.append("file", imageFile);
              // formData.append("timestamp", Date.now().toString());
              // formData.append("api_key", process.env.CLOUDINARY_API_KEY);
              // formData.append(
              //   "upload_preset",
              //   process.env.CLOUDINARY_UPLOAD_PRESET
              // );

              // axios.post(
              //   "https://api.cloudinary.com/v1_1/giaphatocphamphu/image/upload",
              //   formData,
              //   {
              //     headers: {
              //       "Content-Type": "multipart/form-data",
              //     },
              //   }
              // );
            };
            return (
              <input onChange={handleUpload} type="file" accept="image/*" />
            );
          },
          defaultValue: null,
          validate: (value) => {
            console.log(value);

            return true;
          },
          options: [],
        },
      }),
    },
  }),
};
