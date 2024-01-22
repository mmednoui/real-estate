import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Signin from "./pages/Sign/Signin";
import Signup from "./pages/Sign/Signup";
import Header from "./components/Header";
import About from "./pages/about/About";
import PrivateRoute from "./components/PrivateRoute";
import ListingCreation from "./pages/listing/ListingCreation";
import EditListing from "./pages/listing/EditListing";
import Listing from "./pages/listing/Listing";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />

          <Route path="/create-listing" element={<ListingCreation />} />
          <Route path="/edit-listing/:listingId" element={<EditListing />} />
          <Route path="/listing/:listingId" element={<Listing />} />
        </Route>

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
