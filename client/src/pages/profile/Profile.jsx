import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { IoLogOut } from "react-icons/io5";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";
function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
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
  return (
    <div class="bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
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

          <form>
            <div class="mb-4">
              <input
                onChange={handleChange}
                type="username  "
                value={currentUser.username}
                class="border p-2 rounded w-full"
              />
            </div>
            <div class="mb-4">
              <input
                onChange={handleChange}
                type="email"
                value={currentUser.email}
                class="border p-2 rounded w-full"
              />
            </div>{" "}
            <div class="mb-4">
              <input
                onChange={handleChange}
                type="password"
                placeholder="Password"
                class="border p-2 rounded w-full"
              />
            </div>
            <div className="flex items-center justify-evenly">
              <button
                type="submit"
                id="theme-toggle"
                class="px-4 py-2 rounded bg-emerald-600 self-center my-5 text-white  hover:bg-emerald-500 focus:outline-none transition-colors"
              >
                Save Changes
              </button>
              <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded inline-flex items-center">
                <IoLogOut className="text-2xl mr-2" />
                <span>Sign Out</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
