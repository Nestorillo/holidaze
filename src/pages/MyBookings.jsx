import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_KEY = "a86d0390-e249-4c5c-b618-c31098b03aff";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");

    async function loadBookings() {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${name}/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );

        const result = await response.json();
        setBookings(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  function getNights(dateFrom, dateTo) {
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    const diff = end - start;

    if (diff <= 0) return 0;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-center">
        <p className="text-gray-500">Loading bookings...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-bold text-teal-600 uppercase tracking-wide">
            Customer area
          </p>
          <h1 className="text-4xl font-extrabold text-slate-900">
            My bookings
          </h1>
          <p className="text-gray-500 mt-1">
            Review your upcoming Holidaze stays.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              No bookings yet
            </h2>
            <p className="text-gray-500 mt-2">
              Search for a venue and book your next holiday.
            </p>
            <Link
              to="/"
              className="inline-block mt-5 bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-700"
            >
              Browse venues
            </Link>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2">
            {bookings.map((booking) => {
              const nights = getNights(booking.dateFrom, booking.dateTo);
              const venue = booking.venue;

              return (
                <article
                  key={booking.id}
                  className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={
                      venue?.media?.[0]?.url ||
                      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
                    }
                    alt={venue?.media?.[0]?.alt || venue?.name || "Venue"}
                    className="w-full h-56 object-cover bg-slate-100"
                  />

                  <div className="p-6">
                    <div className="flex justify-between gap-4 items-start">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {venue?.name || "Venue"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                          {nights} night{nights === 1 ? "" : "s"} ·{" "}
                          {booking.guests} guest
                          {booking.guests === 1 ? "" : "s"}
                        </p>
                      </div>

                      <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold">
                        Booked
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm">
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-gray-500">Check in</p>
                        <p className="font-bold text-slate-900">
                          {new Date(booking.dateFrom).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-gray-500">Check out</p>
                        <p className="font-bold text-slate-900">
                          {new Date(booking.dateTo).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {venue?.id && (
                      <Link
                        to={`/venue/${venue.id}`}
                        className="inline-block mt-5 text-teal-600 font-bold hover:underline"
                      >
                        View venue →
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
