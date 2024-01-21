import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { IoLogOut } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutUserSuccess,
} from "../../app/user/userSlice.js";
import { useNavigate } from "react-router-dom";
function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserSuccess());
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div class="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div class="container mx-auto p-4">
        <div class="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
          <div className="flex justify-between my-5">
            <div>
              <h1 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Personal Information
              </h1>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Use a permanent address where you can receive mail.
              </p>
            </div>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <div className="flex flex-col items-center gap-2 lg:mr-40">
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar || currentUser.avatar}
                className="cursor-pointer rounded-full aspect-square w-16 lg:h-20 lg:w-20 border border-emerald-500"
                alt="profile"
              />
              <p className="text-sm text-center self-center ">
                {fileUploadError ? (
                  <span className="text-red-700">
                    Error Image upload (image must be less than 2 mb)
                  </span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className="text-yellow-500">{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className="text-green-700 font-semibold ">
                    Image uploaded!
                  </span>
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div class="mb-4">
              <input
                onChange={handleChange}
                type="username"
                id="username"
                defaultValue={currentUser.username}
                class="border p-2 rounded w-full"
              />
            </div>
            <div class="mb-4">
              <input
                onChange={handleChange}
                id="email"
                type="email"
                defaultValue={currentUser.email}
                class="border p-2 rounded w-full"
              />
            </div>{" "}
            <div class="mb-4">
              <input
                id="password"
                onChange={handleChange}
                type="password"
                placeholder="Password"
                class="border p-2 rounded w-full"
              />
            </div>
            <div className="flex items-center justify-evenly">
              <button
                disabled={loading}
                type="submit"
                id="theme-toggle"
                class="px-4 py-2 rounded bg-emerald-600 self-center my-5 text-white  hover:bg-emerald-500 focus:outline-none transition-colors"
              >
                {loading ? "Loading..." : "Save Changes"}
              </button>
              <button
                onClick={handleSignOut}
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded inline-flex items-center"
              >
                <IoLogOut className="text-2xl mr-2" />
                <span>Sign Out</span>
              </button>
            </div>
          </form>
          <button className="p-2" onClick={handleShowListings}>
            Show Listings
          </button>
          <p className="text-red-700 mt-5">
            {showListingsError ? "Error showing listings" : ""}
          </p>

          {userListings && userListings.length > 0 && (
            <div>
              <h1 className="text-center mt-7 text-2xl font-semibold">
                Your Listings
              </h1>
              <div className="flex flex-wrap justify-between mt-10 ">
                {userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="border rounded-lg p-3 flex my-2 justify-between items-center "
                    style={{ width: "30%" }}
                  >
                    <Link to={`/listing/${listing._id}`}>
                      <img
                        src={listing.imgUrls[0]}
                        alt="listing cover"
                        className="h-28 w-28 object-contain"
                      />
                    </Link>
                    <Link
                      className="text-slate-700 font-semibold  hover:underline w-1/4 "
                      to={`/listing/${listing._id}`}
                    >
                      <p>{listing.name}</p>
                    </Link>
                    <div className="flex flex-col item-center">
                      <button
                        onClick={() => handleListingDelete(listing._id)}
                        className="text-red-700 uppercase"
                      >
                        Delete
                      </button>
                      <Link to={`/edit-listing/${listing._id}`}>
                        <button className="text-green-700 uppercase">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div
            hidden={!updateSuccess}
            class="p-4 mb-4 text-sm  text-green-800 rounded-lg bg-green-50 max-w-xl mx-auto text-center"
            role="alert"
          >
            {updateSuccess ? "User is updated successfully!" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
