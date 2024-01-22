import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <div className="px-10 py-3 bg-emerald-500 flex items-center justify-center sm:justify-between">
      <ul className="flex items-center">
        <Link to="/">
          <li className="hidden sm:inline text-white font-bold cursor-pointer p-2 hover:opacity-50 duration-150 ease-out ">
            Home
          </li>
        </Link>

        <Link to="/about">
          <li className=" hidden sm:inline text-white font-bold cursor-pointer p-2 hover:opacity-50 duration-150 ease-out ">
            About
          </li>
        </Link>
      </ul>

      <div className="flex ">
        <form onSubmit={handleSubmit} className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <button className="flex z-10 cursor-pointer absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>

            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        {currentUser ? (
          <Link
            to="/profile"
            className="flex items-center font-bold text-emerald-600"
          >
            <img
              className="rounded-full h-12 w-12 object-cover mx-2 border border-emerald-500"
              src={currentUser.avatar}
              alt="profile"
            />
          </Link>
        ) : (
          <Link to="/signup">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg mx-3">
              Sign Up
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
