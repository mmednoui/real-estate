import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  signInDone,
  signInFail,
  signInStart,
} from "../../app/user/userSlice.js";

function Signin() {
  const [formData, setFormData] = useState({});

  const { error, loading } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === "false") {
        dispatch(signInFail(data.message));

        return;
      } else {
        dispatch(signInDone(data));

        navigate("/");
      }
    } catch (error) {
      dispatch(signInFail(data.message));
    }
  };
  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="flex flex-col p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className=" self-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Sign in to your account
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              action="#"
              method="POST"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleChange}
                    placeholder="Email"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 pl-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-emerald-600 hover:text-emerald-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    placeholder="Password"
                    onChange={handleChange}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 pl-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  disabled={loading}
                  type="submit"
                  className="disabled:opacity-60 flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  {loading ? "Loading ..." : " Sign in"}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link to="/signup">
                <a
                  href="#"
                  className="ml-1 font-semibold leading-6 text-emerald-600 hover:text-emerald-500"
                >
                  Join Us
                </a>
              </Link>
            </p>

            {error && (
              <div
                className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-2  text-xs"
                role="alert"
              >
                <p className="font-bold">{error}</p>
                <p>Please verify you email and password</p>
              </div>
            )}

            <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
              <p className="mx-4 mb-0 text-center font-semibold">Or</p>
            </div>
            <div className="flex items-center justify-around">
              <button className="flex items-center  bg-white border border-gray-300 rounded-lg shadow-md px-3 py-3.5 text-sm font-medium text-gray-800 ">
                <FcGoogle className="text-lg mr-2" />
                <span>Continue with Google</span>
              </button>
              <button
                type="button"
                className="flex items-center text-white bg-[#24292F] hover:bg-[#24292F]/90 border border-gray-300 shadow-md font-medium rounded-lg text-sm px-3 py-3.5 text-center  "
              >
                <FaGithub className="text-lg mr-2" />
                Sign in with Github
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signin;
