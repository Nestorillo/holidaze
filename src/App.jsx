import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import CreateVenue from "./pages/CreateVenue";
import MyVenues from "./pages/MyVenues";
import EditVenue from "./pages/EditVenue";
import VenueBookings from "./pages/VenueBookings";

export default function App() {
  const [filters, setFilters] = useState({
    search: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      setFilters({
        search: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
      });
    }
  }, [location.pathname]);

  return (
    <>
      <Navbar />

      {location.pathname === "/" && (
        <SearchBar onSearch={setFilters} />
      )}

      <Routes>
        <Route path="/" element={<Home filters={filters} />} />
        <Route path="/venue/:id" element={<Venue />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/create-venue" element={<CreateVenue />} />
        <Route path="/my-venues" element={<MyVenues />} />
        <Route path="/edit-venue/:id" element={<EditVenue />} />
        <Route path="/venue-bookings/:id" element={<VenueBookings />} />
      </Routes>
    </>
  );
}