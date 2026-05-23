import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home({ filters }) {
  const [venues, setVenues] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetch("https://v2.api.noroff.dev/holidaze/venues?limit=60&_bookings=true")
      .then((res) => res.json())
      .then((data) => setVenues(data.data || []))
      .catch(console.error);
  }, []);

  function datesOverlap(startA, endA, startB, endB) {
    return startA < endB && endA > startB;
  }

  let filteredVenues = venues.filter((venue) => {
    const searchText = filters?.search || "";
    const guests = Number(filters?.guests || 1);
    const checkIn = filters?.checkIn;
    const checkOut = filters?.checkOut;

    const matchesSearch = venue.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesGuests = venue.maxGuests >= guests;

    let matchesDates = true;

    if (checkIn && checkOut) {
      const selectedStart = new Date(checkIn);
      const selectedEnd = new Date(checkOut);

      matchesDates = !venue.bookings?.some((booking) => {
        const bookedStart = new Date(booking.dateFrom);
        const bookedEnd = new Date(booking.dateTo);

        return datesOverlap(selectedStart, selectedEnd, bookedStart, bookedEnd);
      });
    }

    return matchesSearch && matchesGuests && matchesDates;
  });

  if (sortBy === "priceLow") {
    filteredVenues.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "priceHigh") {
    filteredVenues.sort((a, b) => b.price - a.price);
  }

  if (sortBy === "rating") {
    filteredVenues.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  if (sortBy === "guests") {
    filteredVenues.sort((a, b) => b.maxGuests - a.maxGuests);
  }

  function handleSort(type) {
    setSortBy(type);
    setShowFilter(false);
  }

  function renderStars(rating) {
    const safeRating = Math.round(rating || 0);

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= safeRating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        <div className="flex justify-between items-start mb-8 relative">
          <div>
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wide">
              Explore Holidaze
            </p>

            <h1 className="text-4xl font-bold text-gray-900">
              Popular stays
            </h1>

            <p className="text-gray-500 mt-1">
              {filteredVenues.length} venues available
            </p>
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-white border px-4 py-2 rounded-full text-sm font-semibold shadow hover:shadow-md"
          >
            Filter & Sort
          </button>

          {showFilter && (
            <div className="absolute right-0 top-14 bg-white shadow-lg rounded-xl p-4 w-60 z-50 border">
              <div className="grid gap-2 text-sm">
                <button onClick={() => handleSort("priceLow")}>
                  Price low → high
                </button>
                <button onClick={() => handleSort("priceHigh")}>
                  Price high → low
                </button>
                <button onClick={() => handleSort("rating")}>
                  Best rating
                </button>
                <button onClick={() => handleSort("guests")}>
                  Most guests
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {filteredVenues.map((venue) => (
            <Link
              key={venue.id}
              to={`/venue/${venue.id}`}
              className="group bg-white rounded-2xl shadow hover:shadow-lg transition"
            >
              <img
                src={
                  venue.media?.[0]?.url ||
                  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                }
                className="w-full h-48 object-cover rounded-t-2xl"
              />

              <div className="p-4">
                <h2 className="font-semibold text-gray-900">
                  {venue.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {venue.price} NOK / night
                </p>

                <div className="mt-2 flex justify-between items-center">
                  {renderStars(venue.rating)}
                  <span className="text-sm text-gray-500">
                    {venue.rating || 0}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}