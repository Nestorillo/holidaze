import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [form, setForm] = useState({
    search: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSearch({
      ...form,
      guests: Number(form.guests),
    });
  }

  function handleClear() {
    const resetFilters = {
      search: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
    };

    setForm(resetFilters);
    onSearch(resetFilters);
  }

  return (
    <section className="relative bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center">
      <div className="bg-black/60 px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 text-white">
            <h1 className="text-5xl font-extrabold tracking-tight">
              Find your perfect stay
            </h1>
            <p className="text-white/90 mt-1">
              Search relaxing places, compare prices and book your next holiday.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur rounded-3xl shadow-xl p-4 grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_0.7fr_auto_auto] items-end"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Where to?
              </label>
              <input
                name="search"
                type="text"
                placeholder="Search venue..."
                value={form.search}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Check in
              </label>
              <input
                name="checkIn"
                type="date"
                value={form.checkIn}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Check out
              </label>
              <input
                name="checkOut"
                type="date"
                value={form.checkOut}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Guests
              </label>
              <input
                name="guests"
                type="number"
                min="1"
                value={form.guests}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="bg-teal-600 text-white px-7 py-3 rounded-2xl font-bold hover:bg-teal-700"
            >
              Search
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="bg-slate-100 text-slate-700 px-5 py-3 rounded-2xl font-semibold hover:bg-slate-200"
            >
              Clear
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}