import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-4 font-semibold my-10">
          <p>
            Contact{" "}
            <span className="font-medium italic text-emerald-700">
              {landlord.username}
            </span>{" "}
            for{" "}
            <span className="font-medium italic text-emerald-700">
              {listing.name}
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg font-medium"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-emerald-600 text-white text-center p-3 rounded-lg hover:opacity-95 mt-10"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}

export default Contact;
