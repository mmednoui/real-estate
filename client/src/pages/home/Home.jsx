import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingCard from "../../components/ListingCard";

function Home() {
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const fetchRentListings = async () => {
    try {
      const res = await fetch("/api/listing/get?type=Rent&limit=4");
      const data = await res.json();
      setRentListings(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSaleListings = async () => {
    try {
      const res = await fetch("/api/listing/get?type=sell&limit=4");
      const data = await res.json();
      setSaleListings(data);
    } catch (error) {
      log(error);
    }
  };
  useEffect(() => {
    fetchRentListings();
    fetchSaleListings();
  }, []);

  return (
    <div>
      <div className="p-4  max-w-6xl mx-auto">
        {" "}
        <h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Better Approach
          </span>{" "}
          For Houses
        </h1>
        <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
          Here at kdakda we focus on sipmlifing the procedure of finding ur next
          house using technology and innovation, By just a click in your device
        </p>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-emerald-600 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10 ">
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-emerald-600">
                Recent Places For Rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-emerald-600">
                Recent Places For Sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}

export default Home;
