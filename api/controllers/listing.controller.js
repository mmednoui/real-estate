import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    res.status(201).json("Listing has been created successfully!");
  } catch (error) {
    next(error);
  }
};
