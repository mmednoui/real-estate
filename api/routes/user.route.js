import express from "express";
import { getUserListings, updateUser } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.post("/update/:id", verifyUser, updateUser);
userRouter.get("/listings/:id", verifyUser, getUserListings);
export default userRouter;
