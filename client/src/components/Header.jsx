import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="px-10 py-3 bg-gray-50 flex items-center justify-center sm:justify-between">
      <ul className="flex ">
        <Link to="/">
          <li className="hidden sm:inline font-bold cursor-pointer p-2 hover:opacity-50 duration-150 ease-out ">
            Home
          </li>
        </Link>

        <Link to="/about">
          <li className=" hidden sm:inline font-bold cursor-pointer p-2 hover:opacity-50 duration-150 ease-out ">
            About
          </li>
        </Link>
      </ul>
      <div className="flex ">
        <form className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
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
            </div>

            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              required
            />
          </div>
        </form>
        <Link to="/signup">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg mx-3">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Header;
