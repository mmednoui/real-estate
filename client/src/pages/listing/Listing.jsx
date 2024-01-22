import React from "react";
import CarouselListing from "./CarouselListing";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "flowbite-react";

import { useSelector } from "react-redux";

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../../components/Contact";
function Listing() {
  const [listing, setListing] = useState({});
  const [sliderImages, setSliderImages] = useState([]);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        setListing(data);
        console.log(data);
        setSliderImages(data.imgUrls);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <div>
      <div className="h-56 w-2/3 mx-auto sm:h-64 xl:h-80 2xl:h-96 my-5">
        <Carousel slideInterval={5000}>
          {sliderImages.map((url, index) => (
            <img src={url} alt="..." className="object-contain" key={index} />
          ))}
        </Carousel>
      </div>
      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
        <FaShare
          className="text-slate-500"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        />
      </div>
      {copied && (
        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
          Link copied!
        </p>
      )}
      <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
        <p className="text-2xl font-semibold">
          {listing.name} - {listing.price} ${" "}
          {listing.type === "Rent" && " / month"}
        </p>
        <p className="flex items-center mt-6 gap-2 text-slate-600  text-md">
          <FaMapMarkerAlt className="text-emerald-600 " />
          {listing.address}
        </p>
        <div className="flex gap-4">
          <p className="bg-red-600 w-full max-w-[200px] text-white text-center p-1 rounded-md">
            {listing.type === "Rent" ? "For Rent" : "For Sale"}
          </p>
        </div>
        <div className="my-5">
          <h6 className="font-semibold text-black ">Description</h6>
          <p className="text-slate-800  ">{listing.description}</p>
        </div>
        <ul className="text-emerald-600 font-semibold text-md flex flex-wrap items-center gap-4 sm:gap-6">
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaBed className="text-lg text-emerald-600" />
            {listing.beds > 1
              ? `${listing.beds} beds `
              : `${listing.beds} bed `}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaBath className="text-lg text-emerald-600" />
            {listing.baths > 1
              ? `${listing.baths} baths `
              : `${listing.baths} bath `}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaParking className="text-lg text-emerald-600" />
            {listing.parking ? "Parking spot" : "No Parking"}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaChair className="text-lg text-emerald-600" />
            {listing.furnished ? "Furnished" : "Unfurnished"}
          </li>
        </ul>
        {currentUser && !contact && (
          <button
            onClick={() => setContact(true)}
            className="bg-emerald-600 text-white text-center p-3 rounded-lg hover:opacity-95 my-10"
          >
            Contact landlord
          </button>
        )}
        {contact && <Contact listing={listing} />}
      </div>
    </div>
  );
}

export default Listing;
