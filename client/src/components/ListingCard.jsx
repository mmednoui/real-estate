import React from "react";
import { Link } from "react-router-dom";
import { IoBedOutline } from "react-icons/io5";
import { FaBath } from "react-icons/fa";
function ListingCard({ listing }) {
  return (
    <div className="mx-auto ">
      <Link to={`/listing/${listing._id}`}>
        <div className="flex items-center justify-center">
          <div className="max-w-sm w-full sm:w-full lg:w-full py-6 px-3">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div class="bg-cover bg-center h-auto py-4">
                <div class="mx-auto h-40 w-11/12  rounded-lg">
                  {" "}
                  <img
                    src={
                      listing.imgUrls[0] ||
                      "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
                    }
                    alt="listing cover"
                    className="h-full w-full object-cover hover:scale-105 transition-scale duration-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="p-4">
                <p className="uppercase tracking-wide text-sm font-bold text-gray-700">
                  {listing.name}
                </p>
                <p className="text-3xl text-gray-900">${listing.price}</p>
                <p className="text-gray-700">{listing.address}</p>
              </div>
              <div className="flex py-4 px-3 border-t border-gray-300 text-gray-700 gap-1">
                <div className="flex-1 inline-flex items-center text-sm gap-1">
                  <IoBedOutline />
                  <p>
                    <span className="text-gray-900 font-bold">
                      {listing.beds}
                    </span>{" "}
                    Bedrooms
                  </p>
                </div>
                <div className="flex-1 inline-flex items-center text-sm gap-1">
                  <FaBath />

                  <p>
                    <span className="text-gray-900 font-bold">
                      {listing.baths}
                    </span>{" "}
                    Bathrooms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ListingCard;
