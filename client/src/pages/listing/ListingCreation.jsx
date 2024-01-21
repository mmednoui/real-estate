import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function ListingCreation() {
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imgUrls: [],
    name: "",
    description: "",
    address: "",
    type: "sell",
    beds: 0,
    baths: 0,
    price: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [images, setImages] = useState([]);

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imgUrls.length < 1)
        return setError("You must upload at least one image");

      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const handleImageSubmit = (e) => {
    if (images.length > 0 && images.length + formData.imgUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imgUrls: formData.imgUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const handleChange = (e) => {
    if (e.target.id === "type") {
      setFormData({
        ...formData,
        type: e.target.value,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imgUrls: formData.imgUrls.filter((_, i) => i !== index),
    });
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="p-10 bg-white mx-auto my-10 max-w-3xl"
    >
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Create Your Listing
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            All the fields down here are required
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 ">
            <div className="col-span-full  ">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name Of The Listing
              </label>
              <div className="mt-2 ">
                <div className="flex  rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600  ">
                  <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Name"
                    value={formData.name}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full ">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  type="textarea"
                  onChange={handleChange}
                  id="description"
                  name="description"
                  placeholder="Description"
                  rows={3}
                  className="block pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-full"
                  defaultValue={""}
                  value={formData.description}
                  required
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences about yourself.
              </p>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  onChange={handleChange}
                  placeholder="Address"
                  type="text"
                  name="address"
                  id="address"
                  autoComplete="street-address"
                  value={formData.address}
                  required
                  className="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-full ">
              <div className="block text-sm font-medium leading-6 text-gray-900">
                Listing Images
              </div>
              <div className="mt-2 flex justify-around rounded-lg border border-dashed border-gray-900/25 px-6 py-10 w-full">
                <div className="text-center">
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="imgUrls"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        required
                        onChange={(e) => setImages(e.target.files)}
                        id="imgUrls"
                        name="imgUrls"
                        type="file"
                        className="sr-only"
                        accept="images/*"
                        multiple
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleImageSubmit}
                  className="border border-emerald-600 px-5 rounded text-emerald-600"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
          <p className="text-red-600 text-sm mt-2">
            {imageUploadError && imageUploadError}
          </p>

          <div className="flex flex-wrap justify-around text-sm ">
            {formData.imgUrls.length > 0 &&
              formData.imgUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center my-2 rounded-lg"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-24 h-24 object-contain rounded-lg "
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                Additional Information
              </legend>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      onChange={handleChange}
                      id="furnished"
                      name="furnished"
                      type="checkbox"
                      checked={formData.furnished}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="furnished"
                      className="font-medium text-gray-900"
                    >
                      Furnished
                    </label>
                    <p className="text-gray-500">
                      Get notified when someones posts <br />a comment on a
                      posting.
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      onChange={handleChange}
                      checked={formData.parking}
                      id="parking"
                      name="parking"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="parking"
                      className="font-medium text-gray-900"
                    >
                      Parking
                    </label>
                    <p className="text-gray-500">
                      Get notified when someones posts a comment on a posting.
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      onChange={handleChange}
                      checked={formData.offer}
                      id="offer"
                      name="offer"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="offer"
                      className="font-medium text-gray-900"
                    >
                      Offer
                    </label>
                    <p className="text-gray-500">
                      Get notified when a candidate applies for a job.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
            <div>
              <label
                for="type"
                class="block text-sm mb-3 font-medium text-gray-900 dark:text-white"
              >
                Type Of The Listing
              </label>
              <select
                onChange={handleChange}
                value={formData.type}
                id="type"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
              >
                <option>Sell</option>
                <option>Rent</option>
              </select>
            </div>
            <div className="flex mt-10 gap-5">
              <div className="w-1/6">
                <div>
                  <label
                    htmlFor="beds"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Bedrooms
                  </label>
                  <div className="mt-2   ">
                    <div className="flex  rounded-md shadow-sm ring-1 ring-inset ring-gray-300   ">
                      <input
                        onChange={handleChange}
                        requiredv
                        type="number"
                        name="beds"
                        id="beds"
                        className=" w-1/6 block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="Beds"
                        defaultValue={0}
                        value={formData.beds}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/6">
                <div>
                  <label
                    htmlFor="baths"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Baths
                  </label>
                  <div className="mt-2 ">
                    <div className="flex  rounded-md shadow-sm ring-1 ring-inset ring-gray-300   ">
                      <input
                        onChange={handleChange}
                        required
                        type="number"
                        name="baths"
                        id="baths"
                        className="w-1/6 block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="Baths"
                        defaultValue={0}
                        value={formData.baths}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-auto mr-10">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Price
                  </label>
                  <div className="mt-2 ">
                    <div className="flex  rounded-md shadow-sm ring-1 ring-inset ring-gray-300   ">
                      <input
                        onChange={handleChange}
                        required
                        type="number"
                        name="price"
                        id="price"
                        className=" w-1/6 block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="Price"
                        defaultValue={0}
                        value={formData.price}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          disabled={loading || uploading}
          type="submit"
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {loading ? "Creating..." : "Create listing"}
        </button>
      </div>
      {error && <p className="text-red-700 text-sm">{error}</p>}
    </form>
  );
}

export default ListingCreation;
