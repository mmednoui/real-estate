import React, { useState } from "react";
import { Carousel } from "flowbite-react";
import { useParams } from "react-router-dom";
function CarouselListing() {
  const [sliderImages, setSliderImages] = useState([]);
  const params = useParams();
  const fetchImages = async () => {
    const listingId = params.listingId;
    const res = await fetch(`/api/listing/get/${listingId}`);
    const data = await res.json();
    setSliderImages(data.imgUrls);
  };

  fetchImages();
  return (
    <div className="h-56 w-2/3 mx-auto sm:h-64 xl:h-80 2xl:h-96 my-5">
      <Carousel slideInterval={5000}>
        {sliderImages.map((url) => (
          <img src={url} alt="..." className="object-contain" />
        ))}
      </Carousel>
    </div>
  );
}

export default CarouselListing;
