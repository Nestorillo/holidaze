import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVenueWithBookings } from "../api/api";

export default function VenueBookings() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    async function loadVenueBookings() {
      const result = await getVenueWithBookings(id);
      setVenue(result.data);
    }

    loadVenueBookings();
  }, [id]);

  if (!venue) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-center">
        <p className="text-gray-500">Loading bookings...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-5xl mx-auto px-6 py-10">
        <Link
          to="/my-venues"
          className="inline-block mb-6 text-teal-700 font-semibold hover:underline"
        >
          ← Back to my venues
        </Link>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8">
          <img
            src={
              venue.media?.[0]?.url ||
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
            }
            alt={venue.media?.[0]?.alt || venue.name}
            className="w-full h-72 object-cover bg-slate-100"
          />

          <div className="p-8">
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wide">
              Venue bookings
            </p>
            <h1 className="text-4xl font-extrabold text-slate-900">
              {venue.name}
            </h1>
            <p className="text-gray-500 mt-1">
              {venue.bookings?.length || 0} upcoming booking
              {(venue.bookings?.length || 0) === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {venue.bookings?.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              No bookings yet
            </h2>
            <p className="text-gray-500 mt-2">
              Customer bookings for this venue will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Check in</th>
                    <th className="px-6 py-4">Check out</th>
                    <th className="px-6 py-4">Guests</th>
                  </tr>
                </thead>

                <tbody>
                  {venue.bookings?.map((booking) => (
                    <tr key={booking.id} className="border-t">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {new Date(booking.dateFrom).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(booking.dateTo).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{booking.guests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
