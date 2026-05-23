import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const isManager = localStorage.getItem("venueManager") === "true";

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <nav className="bg-teal-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-tight">
        Holidaze
      </Link>

      <div className="flex gap-5 items-center text-sm">
        <Link to="/" className="hover:opacity-80">
          Home
        </Link>

        {!token && (
          <>
            <Link
              to="/login"
              className={
                location.pathname === "/login"
                  ? "bg-white text-teal-700 px-4 py-2 rounded-lg font-semibold"
                  : "hover:opacity-80"
              }
            >
              Login
            </Link>

            <Link
              to="/register"
              className={
                location.pathname === "/register"
                  ? "bg-white text-teal-700 px-4 py-2 rounded-lg font-semibold"
                  : "hover:opacity-80"
              }
            >
              Register
            </Link>
          </>
        )}

        {token && (
          <>
            <Link to="/my-bookings" className="hover:opacity-80">
              My bookings
            </Link>

            {isManager && (
              <>
                <Link to="/create-venue" className="hover:opacity-80">
                  Create venue
                </Link>

                <Link to="/my-venues" className="hover:opacity-80">
                  My venues
                </Link>
              </>
            )}

            <Link
              to="/profile"
              className="flex items-center gap-2 hover:opacity-80"
            >
              <div className="text-right hidden sm:block">
                <p className="font-semibold leading-tight">{name}</p>
                <p className="text-xs opacity-80">
                  {isManager ? "Venue Manager" : "Customer"}
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-white text-teal-700 flex items-center justify-center font-bold">
                {name?.charAt(0).toUpperCase()}
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-rose-500 px-4 py-2 rounded-lg font-semibold hover:bg-rose-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;