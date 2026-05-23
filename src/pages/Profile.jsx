import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/api";

export default function Profile() {
  const name = localStorage.getItem("name");

  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    avatar: "",
    banner: "",
    venueManager: false,
  });

  useEffect(() => {
    async function loadProfile() {
      const result = await getProfile(name, "?_bookings=true");

      if (result.data) {
        setProfile(result.data);

        setForm({
          avatar: result.data.avatar?.url || "",
          banner: result.data.banner?.url || "",
          venueManager: result.data.venueManager || false,
        });
      } else {
        setMessage(result.errors?.[0]?.message || "Could not load profile.");
      }
    }

    if (name) {
      loadProfile();
    }
  }, [name]);

  async function handleUpdate(e) {
    e.preventDefault();

    const result = await updateProfile(name, {
      avatar: {
        url: form.avatar,
        alt: `${name} avatar`,
      },
      banner: {
        url: form.banner,
        alt: `${name} banner`,
      },
      venueManager: form.venueManager,
    });

    if (result.data) {
      setProfile(result.data);
      localStorage.setItem("venueManager", String(result.data.venueManager));
      setShowModal(false);
      setMessage("Profile updated successfully.");
    } else {
      setMessage(result.errors?.[0]?.message || "Could not update profile.");
    }
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-center">
        <p className="text-gray-500">Loading profile...</p>
        {message && <p className="mt-4 text-rose-600">{message}</p>}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="h-72 w-full overflow-hidden">
        <img
          src={
            profile.banner?.url ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
          }
          alt={profile.banner?.alt || "Profile banner"}
          className="w-full h-full object-cover"
        />
      </div>

      <section className="max-w-6xl mx-auto px-6 -mt-20">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          <img
            src={
              profile.avatar?.url ||
              "https://i.pravatar.cc/300"
            }
            alt={profile.avatar?.alt || "Profile avatar"}
            className="w-40 h-40 rounded-3xl border-4 border-white shadow-xl object-cover bg-white"
          />

          <div className="pb-4">
            <h1 className="text-4xl font-extrabold text-slate-900">
              {profile.name}
            </h1>

            <p className="text-gray-500">{profile.email}</p>

            <p className="text-sm font-semibold text-teal-600 mt-1">
              {profile.venueManager ? "Venue Manager" : "Customer"}
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-4 border border-gray-300 bg-white px-5 py-2 rounded-xl font-semibold hover:bg-gray-100"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {message && (
          <p className="mt-6 bg-teal-50 text-teal-700 p-4 rounded-2xl font-semibold">
            {message}
          </p>
        )}

        <div className="mt-12 grid md:grid-cols-[260px_1fr] gap-8">
          <aside className="space-y-3">
            <button className="w-full border rounded-2xl p-4 bg-teal-50 text-teal-700 font-bold">
              Your Bookings ({profile.bookings?.length || 0})
            </button>

            <button className="w-full border rounded-2xl p-4 bg-white text-gray-500 font-semibold">
              Your Favorites (0)
            </button>
          </aside>

          <section className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Your bookings
            </h2>

            {profile.bookings?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500 border-b">
                    <tr>
                      <th className="py-3">Venue</th>
                      <th className="py-3">Booked dates</th>
                      <th className="py-3">Guests</th>
                    </tr>
                  </thead>

                  <tbody>
                    {profile.bookings.map((booking) => (
                      <tr key={booking.id} className="border-b">
                        <td className="py-4 font-semibold">
                          {booking.venue?.name || "Venue"}
                        </td>
                        <td className="py-4">
                          {new Date(booking.dateFrom).toLocaleDateString()} -{" "}
                          {new Date(booking.dateTo).toLocaleDateString()}
                        </td>
                        <td className="py-4">{booking.guests}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">You have no bookings yet.</p>
            )}
          </section>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-extrabold">Edit Profile</h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-3xl leading-none hover:text-rose-500"
              >
                ×
              </button>
            </div>

            <label className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                checked={form.venueManager}
                onChange={(e) =>
                  setForm({ ...form, venueManager: e.target.checked })
                }
              />
              <span className="font-bold">Venue Manager</span>
            </label>

            <label className="block font-bold mb-2">Banner URL</label>
            <input
              value={form.banner}
              onChange={(e) => setForm({ ...form, banner: e.target.value })}
              className="w-full border rounded-2xl px-4 py-3 mb-4"
              placeholder="https://..."
            />

            {form.banner && (
              <img
                src={form.banner}
                alt="Banner preview"
                className="w-full h-40 object-cover rounded-2xl mb-6"
              />
            )}

            <label className="block font-bold mb-2">Avatar URL</label>
            <input
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              className="w-full border rounded-2xl px-4 py-3 mb-4"
              placeholder="https://..."
            />

            {form.avatar && (
              <img
                src={form.avatar}
                alt="Avatar preview"
                className="w-32 h-32 object-cover rounded-full mb-6"
              />
            )}

            <button className="w-full bg-teal-600 text-white py-3 rounded-2xl font-bold hover:bg-teal-700">
              Save profile
            </button>
          </form>
        </div>
      )}
    </main>
  );
}