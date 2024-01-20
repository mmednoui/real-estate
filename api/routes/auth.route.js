import express from "express";
import {
  signin,
  signup,
  googleAuth,
  signOut,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/google", googleAuth);
authRouter.get("/signout", signOut);

export default authRouter;
