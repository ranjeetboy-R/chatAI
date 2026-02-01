import dotenv from "dotenv";
dotenv.config();

// 🔥 IMPORTANT: namespace import
import * as ImageKitSDK from "@imagekit/nodejs";

const ImageKit = ImageKitSDK.default || ImageKitSDK;

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
