import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteVenue, getProfile } from "../api/api";

export default function MyVenues() {
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState("");
  const name = localStorage.getItem("name");

  useEffect(() => {
    async function fetchMyVenues() {
      const result = await getProfile(name, "?_venues=true");
      setVenues(result.data?.venues || []);
    }

    if (name) {
      fetchMyVenues();
    }
  }, [name]);

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue?"
    );

    if (!confirmDelete) return;

    const response = await deleteVenue(id);

    if (response.ok) {
      setVenues((prev) => prev.filter((venue) => venue.id !== id));
      setMessage("Venue deleted successfully.");
    } else {
      setMessage("Could not delete venue.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-8">
          <div>
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wide">
              Venue manager
            </p>
            <h1 className="text-4xl font-extrabold text-slate-900">
              My venues
            </h1>
            <p className="text-gray-500 mt-1">
              Manage the venues you have created.
            </p>
          </div>

          <Link
            to="/create-venue"
            className="bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-700"
          >
            Create venue
          </Link>
        </div>

        {message && (
          <p className="mb-6 bg-teal-50 text-teal-700 p-4 rounded-2xl font-semibold">
            {message}
          </p>
        )}

        {venues.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              No venues yet
            </h2>
            <p className="text-gray-500 mt-2">
              Create your first Holidaze venue to start accepting bookings.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <article
                key={venue.id}
                className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={
                    venue.media?.[0]?.url ||
                    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
                  }
                  alt={venue.media?.[0]?.alt || venue.name}
                  className="h-52 w-full object-cover bg-slate-100"
                />

                <div className="p-6">
                  <div className="flex justify-between gap-3 items-start">
                    <div>
                      <h2 className="font-bold text-xl text-slate-900 line-clamp-2">
                        {venue.name}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        {venue.maxGuests} guests
                      </p>
                    </div>

                    <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                      {venue.price} NOK
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <Link
                      to={`/venue/${venue.id}`}
                      className="text-center border rounded-2xl py-2 font-semibold hover:bg-slate-50"
                    >
                      View
                    </Link>

                    <Link
                      to={`/edit-venue/${venue.id}`}
                      className="text-center border rounded-2xl py-2 font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </Link>

                    <Link
                      to={`/venue-bookings/${venue.id}`}
                      className="text-center border rounded-2xl py-2 font-semibold text-teal-600 hover:bg-teal-50"
                    >
                      Bookings
                    </Link>

                    <button
                      onClick={() => handleDelete(venue.id)}
                      className="border rounded-2xl py-2 font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
