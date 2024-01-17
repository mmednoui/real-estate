import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose
  .connect(process.env.mongo)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("not connected");
  });

const app = express();

app.listen(3000, () => {
  console.log("heeyyy running on 3000fez");
});
