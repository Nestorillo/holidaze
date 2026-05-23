import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createBooking } from "../api/api";

const API_URL = "https://v2.api.noroff.dev/holidaze/venues";
const API_KEY = "a86d0390-e249-4c5c-b618-c31098b03aff";

export default function Venue() {
  const { id } = useParams();

  const [venue, setVenue] = useState(null);
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState({
    dateFrom: "",
    dateTo: "",
    guests: 1,
  });

  useEffect(() => {
    async function loadVenue() {
      const response = await fetch(
        `${API_URL}/${id}?_owner=true&_bookings=true`,
        {
          headers: {
            "X-Noroff-API-Key": API_KEY,
          },
        }
      );

      const result = await response.json();
      setVenue(result.data);
    }

    loadVenue();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;

    setBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function getNights() {
    if (!booking.dateFrom || !booking.dateTo) return 0;

    const start = new Date(booking.dateFrom);
    const end = new Date(booking.dateTo);
    const diff = end - start;

    if (diff <= 0) return 0;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  async function handleBooking(e) {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in before making a booking.");
      return;
    }

    if (!booking.dateFrom || !booking.dateTo) {
      setMessage("Please select check in and check out dates.");
      return;
    }

    if (getNights() <= 0) {
      setMessage("Check out date must be after check in date.");
      return;
    }

    if (Number(booking.guests) > venue.maxGuests) {
      setMessage(`This venue only allows ${venue.maxGuests} guests.`);
      return;
    }

    if (Number(booking.guests) < 1) {
      setMessage("Guests must be at least 1.");
      return;
    }

    const result = await createBooking({
      dateFrom: booking.dateFrom,
      dateTo: booking.dateTo,
      guests: Number(booking.guests),
      venueId: id,
    });

    if (result.data?.id) {
      setMessage("Successfully booked venue.");
      setBooking({
        dateFrom: "",
        dateTo: "",
        guests: 1,
      });

      const response = await fetch(
        `${API_URL}/${id}?_owner=true&_bookings=true`,
        {
          headers: {
            "X-Noroff-API-Key": API_KEY,
          },
        }
      );

      const updatedVenue = await response.json();
      setVenue(updatedVenue.data);
    } else {
      setMessage(result.errors?.[0]?.message || "Could not create booking.");
    }
  }

  function renderFacilities() {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <li>{venue.meta?.wifi ? "✓ Wifi" : "✕ No wifi"}</li>
        <li>{venue.meta?.parking ? "✓ Parking" : "✕ No parking"}</li>
        <li>{venue.meta?.breakfast ? "✓ Breakfast" : "✕ No breakfast"}</li>
        <li>{venue.meta?.pets ? "✓ Pets allowed" : "✕ No pets"}</li>
      </ul>
    );
  }

  if (!venue) {
    return <p className="p-8 text-center text-gray-500">Loading venue...</p>;
  }

  const imageUrl =
    venue.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";

  const nights = getNights();
  const guests = Number(booking.guests || 1);
  const total = nights * venue.price * guests;

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <section className="max-w-7xl mx-auto px-6 py-8">
        <Link
          to="/"
          className="inline-block mb-6 text-teal-700 font-semibold hover:underline"
        >
          ← Back to venues
        </Link>
        <div className="rounded-3xl overflow-hidden shadow-lg bg-slate-200 mb-8 aspect-video max-h-130">
          <img
            src={imageUrl}
            alt={venue.media?.[0]?.alt || venue.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-3xl shadow-sm p-8">
              <div className="flex justify-between gap-4 items-start">
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
                    {venue.name}
                  </h1>

                  <p className="text-gray-500 mt-2">
                    📍 {venue.location?.city || "Unknown city"},{" "}
                    {venue.location?.country || "Unknown country"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-teal-600 text-2xl font-bold">
                    ★ {venue.rating || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    {venue.maxGuests} guests
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {venue.description || "No description available."}
              </p>
            </section>

            <section className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Facilities
              </h2>
              {renderFacilities()}
            </section>

            <section className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Map</h2>

              <div className="h-64 rounded-2xl overflow-hidden bg-teal-50 flex items-center justify-center text-center">
                <div>
                  <div className="w-14 h-14 mx-auto rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl shadow-lg mb-3">
                    📍
                  </div>
                  <p className="font-bold text-slate-800">
                    {venue.location?.city || "Location preview"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {venue.location?.country || "Holidaze destination"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-sm p-8 flex items-center gap-4">
              <img
                src={
                  venue.owner?.avatar?.url ||
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                }
                alt={venue.owner?.name || "Host"}
                className="w-16 h-16 rounded-full object-cover bg-slate-200"
              />

              <div>
                <p className="text-sm text-gray-500">Hosted by</p>
                <p className="font-bold text-slate-900">
                  {venue.owner?.name || "Holidaze host"}
                </p>
              </div>
            </section>
          </div>

          <aside className="bg-white rounded-3xl shadow-xl p-7 sticky top-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
              Check availability
            </h2>

            <div className="flex justify-between items-center mt-5 mb-5">
              <p>
                <span className="text-3xl font-extrabold text-slate-900">
                  {venue.price} NOK
                </span>
                <span className="text-gray-500"> / night</span>
              </p>

              <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold">
                {venue.maxGuests} guests
              </span>
            </div>

            <form onSubmit={handleBooking} className="grid gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Check in
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  value={booking.dateFrom}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Check out
                </label>
                <input
                  type="date"
                  name="dateTo"
                  value={booking.dateTo}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Guests
                </label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  max={venue.maxGuests}
                  value={booking.guests}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="border-t pt-4 text-sm text-gray-600">
                {nights > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span>
                        {venue.price} NOK × {nights} night
                        {nights > 1 ? "s" : ""} × {guests} guest
                        {guests > 1 ? "s" : ""}
                      </span>
                      <span className="font-bold text-slate-900">
                        {total} NOK
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Total for all guests and nights.
                    </p>
                  </>
                ) : (
                  <p>Select booking dates and number of guests.</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-2xl font-bold hover:bg-teal-700 transition"
              >
                Book now
              </button>
            </form>

            {message && (
              <div
                className={`mt-4 rounded-2xl p-4 text-sm font-semibold ${message.includes("Successfully")
                    ? "bg-teal-50 text-teal-700"
                    : "bg-rose-50 text-rose-600"
                  }`}
              >
                {message}
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}