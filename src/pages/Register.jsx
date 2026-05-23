import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const newUser = {
      name,
      email,
      password,
      venueManager: Boolean(venueManager),
    };

    const result = await registerUser(newUser);

    if (result.data) {
      navigate("/login");
    } else {
      setMessage(result.errors?.[0]?.message || "Registration failed");
    }
  }

  return (
    <main
      className="h-screen bg-cover bg-center flex items-center justify-center px-6 overflow-hidden pt-20"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1800&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-md -mt-16">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-7 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Create account
            </h1>

            <p className="text-white/80">
              Join Holidaze and discover unique stays.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <input
              type="text"
              value={name}
              placeholder="Username"
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/15 px-4 py-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />

            <input
              type="email"
              value={email}
              placeholder="yourname@stud.noroff.no"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/15 px-4 py-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />

            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/15 px-4 py-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />

            <label className="flex items-center gap-3 text-white/90 text-sm">
              <input
                type="checkbox"
                checked={venueManager}
                onChange={(e) => setVenueManager(e.target.checked)}
                className="w-4 h-4"
              />
              Register as Venue Manager
            </label>

            <button className="bg-teal-600 hover:bg-teal-700 transition text-white py-4 rounded-2xl font-bold shadow-lg">
              Register
            </button>
          </form>

          {message && (
            <p className="mt-4 text-red-300 text-sm text-center">
              {message}
            </p>
          )}

          <p className="mt-8 text-center text-white/80 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white font-semibold hover:text-teal-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}