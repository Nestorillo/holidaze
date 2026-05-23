import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, getProfile } from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await loginUser({ email, password });

    if (result.data?.accessToken) {
      localStorage.setItem("token", result.data.accessToken);
      localStorage.setItem("name", result.data.name);
      localStorage.setItem("email", result.data.email);

      const profileResult = await getProfile(result.data.name);

      localStorage.setItem(
        "venueManager",
        String(profileResult.data?.venueManager)
      );

      window.location.href = "/";
    } else {
      setMessage(result.errors?.[0]?.message || "Login failed");
    }
  }

  return (
    <main

      className="h-screen bg-cover bg-center flex items-center justify-center px-6 overflow-hidden pt-20"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 w-full max-w-md -mt-16">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-7 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Welcome back
            </h1>

            <p className="text-white/80">
              Sign in and continue your next adventure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
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

            <button className="bg-teal-600 hover:bg-teal-700 transition text-white py-4 rounded-2xl font-bold shadow-lg">
              Login
            </button>
          </form>

          {message && (
            <p className="mt-4 text-red-300 text-sm text-center">
              {message}
            </p>
          )}

          <p className="mt-8 text-center text-white/80 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-white font-semibold hover:text-teal-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;