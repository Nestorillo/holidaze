import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVenueById, updateVenue } from "../api/api";

export default function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    maxGuests: "",
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  useEffect(() => {
    async function loadVenue() {
      const result = await getVenueById(id);
      const venue = result.data;

      setFormData({
        name: venue.name || "",
        description: venue.description || "",
        imageUrl: venue.media?.[0]?.url || "",
        price: venue.price || "",
        maxGuests: venue.maxGuests || "",
        wifi: venue.meta?.wifi || false,
        parking: venue.meta?.parking || false,
        breakfast: venue.meta?.breakfast || false,
        pets: venue.meta?.pets || false,
      });
    }

    loadVenue();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const venueData = {
      name: formData.name,
      description: formData.description,
      media: formData.imageUrl
        ? [{ url: formData.imageUrl, alt: formData.name }]
        : [],
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      meta: {
        wifi: formData.wifi,
        parking: formData.parking,
        breakfast: formData.breakfast,
        pets: formData.pets,
      },
    };

    const result = await updateVenue(id, venueData);

    if (result.data?.id) {
      navigate(`/venue/${result.data.id}`);
    } else {
      setMessage(result.errors?.[0]?.message || "Could not update venue.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-bold text-teal-600 uppercase tracking-wide">
            Venue manager
          </p>
          <h1 className="text-4xl font-extrabold text-slate-900">
            Edit venue
          </h1>
          <p className="text-gray-500 mt-1">
            Update venue details and availability information.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_0.9fr] gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-sm p-8 grid gap-5"
          >
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Venue name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-2xl px-4 py-3 min-h-36 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Image URL
              </label>
              <input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Price per night (NOK)
                </label>
                <input
                  name="price"
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Max guests
                </label>
                <input
                  name="maxGuests"
                  type="number"
                  min="1"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <p className="block text-sm font-bold text-slate-700 mb-3">
                Facilities
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  ["wifi", "Wifi"],
                  ["parking", "Parking"],
                  ["breakfast", "Breakfast"],
                  ["pets", "Pets allowed"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="border rounded-2xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      name={key}
                      checked={formData[key]}
                      onChange={handleChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {message && (
              <p className="bg-rose-50 text-rose-600 p-4 rounded-2xl font-semibold">
                {message}
              </p>
            )}

            <button className="bg-teal-600 text-white rounded-2xl py-3 font-bold hover:bg-teal-700">
              Save changes
            </button>
          </form>

          <aside className="bg-white rounded-3xl shadow-sm p-6 sticky top-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Preview
            </h2>

            <img
              src={
                formData.imageUrl ||
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
              }
              alt={formData.name || "Venue preview"}
              className="w-full h-64 object-cover rounded-2xl bg-slate-100"
            />

            <h3 className="text-2xl font-extrabold text-slate-900 mt-5">
              {formData.name || "Venue name"}
            </h3>

            <p className="text-gray-500 mt-1 line-clamp-3">
              {formData.description || "Venue description"}
            </p>

            <div className="flex justify-between items-center mt-5">
              <span className="font-bold text-slate-900">
                {formData.price || 0} NOK / night
              </span>
              <span className="text-sm text-gray-500">
                {formData.maxGuests || 0} guests
              </span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
